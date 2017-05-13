"use strict";

const Account = require('./account.js');
const Mortgage = require('./mortgage.js');
const CouponStrategy = require('./couponstrategy.js');
const Job = require('./job.js');

var express = require('express');
var app = express();
var json = require('express-json');
var bodyParser = require('body-parser')

var loadedModules = []

app.use(json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))

/**
 * Calculates how a mortgage evolves with the time
 * @param {int} mortgage - Initial
 * @param {float} interest - Monthly interest
 * @param {int} term - Mortgage term (i.e.: number of total months)
 * @param {object} partial_amortization - 
 */
function calculate(mortgage, interest, term, partial_amortizations) {
    var account = new Account("Cuenta principal", 10000);
    var taxes = {};
    taxes.vat = 0.20;
    taxes.suscription = 0.05;
    var couponStrategyFund = new CouponStrategy(30000, 12, 0, 0, account, taxes, 0.01, 0.025);
    var mortgage = new Mortgage(mortgage, interest, term, partial_amortizations, account);

    for (let month=0; month<30*12; month++) {
	account.step()
	couponStrategyFund.step()
	mortgage.step()
    }// for

    //    console.warn(mortgage.values())

    return {
	account:account.values(),
	    couponstrategy:couponStrategyFund.values()
    }

}// calculate

app.get('/dummy2', function(req, res) {

});

app.get('/dummy', function(req, res) {
    let _payments = calculate(100000, 1.2/12, 360, {});
    console.log ("Cuota: " + _payments.payment);
    console.log ("Hipoteca: 100000");
    console.log ("Pagado al banco: " + _payments.totalPayment);
    console.log ("Intereses: " + ( _payments.totalPayment - 100000));
    res.send(_payments);
});

app.post('/account', function(req, res) {
	let name = req.body.name;
	let initial = parseInt(req.body.initial);

	loadedModules.push(new Account(name, initial));
	res.send()
})

app.post('/mortgage', function(req, res) {
	// first of all, an Account should
	// have beend created
	if (loadedModules.length==0) {
	    res.status(405).end();
	    return;
	}

	let mortgage = req.body.mortgage;
	let interest = parseInt(req.body.interest)/12;
	let term = req.body.term;
	// TODO: checks
	// TODO: partial amortizations
	loadedModules.push(new Mortgage(mortgage, interest, term, {}, loadedModules[0] ));
	res.send({})
    });

app.post('/job', function(req, res) {
    // first of all, an Account should
    // have beend created
    if (loadedModules.length == 0) {
	res.status(405).end();
	return;
    }

    let salary = parseInt(req.body.salary);
    let name = req.body.name;

    loadedModules.push(new Job(name, loadedModules[0], salary));
    res.send();
});

app.post('/coupon', function(req, res) {
	// first of all, an Account should
	// have beend created
	if (loadedModules.length == 0) {
	    res.status(405).end();
	    return;
	}

	let deposit = req.body.deposit;
	let fund = req.body.fund;
	let initialMonth = req.body.initialMonth;
	let taxes = JSON.parse(req.body.taxes);
	let dividend = req.body.dividend;
	let interest = req.body.interest;

	loadedModules.push(new CouponStrategy(deposit, 12,fund, initialMonth, loadedModules[0], taxes, dividend, interest))

	res.send()
    });

app.post('/simulation', function(req, res){
	console.warn("simulation!");
});


app.get('/simulation', function(req, res) {
   let duration = req.query.duration;
    
    for (let month=0; month<duration; month++) {
	loadedModules.forEach(function(module) {
	    module.step();
	});
    }// for
    
    loadedModules.forEach(function(module) {
	if (module instanceof Account) {
	    console.warn(module.name, module.values());
	}
    });
	
    res.send();
})

app.get('/', function (req, res) {
	let _mortgage;
	let _interest;
	let _monthlyInterest;
	let _term;
	let _amortization;
	let _partial;
	let _duration = 240;

	_mortgage = req.query['mortgage'];
	_interest = req.query['interest'];
	_term = req.query['term'];

	if (typeof(req.query['partial']) == 'undefined') {
	    console.warn('No amortization data');
	} else if (typeof(req.query['partial']) == 'object' ) {
	    _partial = req.query['partial'].map(function(i){return JSON.parse(i)});
	} else {
	    // converting to array to access it in the same
	    // way regardless the number of elements
	_partial = [JSON.parse(req.query['partial'])]
    }

    if ((_mortgage === undefined) || 
	(_term === undefined) ||
	(_interest === undefined)) {
	res.status(400)
	res.send("Bad request - term, mortgage or interest undefined")
	return
    }

    if (_partial !== undefined) {
	// TODO: check partial amortizations format
	console.warn(_partial)
    }

    _monthlyInterest = _interest/12

    let _payments = calculate(_mortgage, _monthlyInterest, _term, _partial)

    console.log ("Cuota: " + _payments.payment)
    console.log ("Hipoteca: " + _mortgage)
    console.log ("Pagado al banco: " + _payments.totalPayment)
    console.log ("Intereses: " + ( _payments.totalPayment - _mortgage))

    res.send(_payments);
});

var server = app.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Mortgage simulator listening at http://%s:%s', host, port);
});

// TODO:
//    * modelar liquidar de golpe (cuando el capital pendiente sea igual a una cantidad dada)
//    * euribor variable
//    * inversion de ahorro
//    * ligar ahorro con amortizaciones parciales??
//    * parametrizar ahorro mensual
//    * calcular porcentaje de intereses pagados y pendientes de pagar
//    * corregir valores de primer y último mes
//    * [frontend] varias simulaciones. Mostrar solo una tabla al mismo tiempo.
//                 Tarjetas para elegir qué datos se agregan a gráficas
//    * encapsular los ingresos en cuenta como objetos para saber de donde vienen
//    * mover ahorros teniendo en cuenta IPC a cuenta
// configurar coupon strategy para que se genere automáticamente cuando  hay más de cierta cantidad en cuenta. Lo mismo para un depósito
