"use strict";
const Account = require('./account.js')
const Mortgage = require('./mortgage.js')
const CouponStrategy = require('./couponstrategy.js')

var express = require('express');
var app = express();
var json = require('express-json');

app.use(json())
app.use(express.static('public'))


/**
 * Calculates how a mortgage evolves with the time
 * @param {int} mortgage - Initial
 * @param {float} interest - Monthly interest
 * @param {int} term - Mortgage term (i.e.: number of total months)
 * @param {object} partial_amortization - 
 */
function calculate(mortgage, interest, term, partial_amortizations) {

    var account = new Account(10000)
    var couponStrategyFund = new CouponStrategy(30000, 0, 0, account, 0.20, 0.01)
    var mortgage = new Mortgage(mortgage, interest, term, partial_amortizations, account)
    
    for (let month=0; month<30*12; month++) {
	account.step()
	couponStrategyFund.step()
	mortgage.step()

    }// for

    console.warn(mortgage.values())

    return {}

}// calculate

app.get('/', function (req, res) {
    let _mortgage
    let _interest
    let _monthlyInterest
    let _term
    let _amortization
    let _partial
    let _duration = 240
    
    _mortgage = req.query['mortgage']
    _interest = req.query['interest']
    _term = req.query['term']

    if (typeof(req.query['partial']) == 'undefined') {
	console.warn('No amortization data')
    } else if (typeof(req.query['partial']) == 'object' ) {
	_partial = req.query['partial'].map(function(i){return JSON.parse(i)})	
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
