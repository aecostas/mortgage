"use strict";
var express = require('express');
var app = express();
var json = require('express-json');
var savings = 500

app.use(json())
app.use(express.static('public'))

class CouponStrategy {
    constructor(deposit, fund, initialmonth, duration, account) {
	this.deposit = Array(duration).fill(deposit)
	this.fund = Array(duration).fill(fund)
	this.output = deposit/12
	this.input = deposit/12 - (deposit/12)*0.05
	this.deposit[0] = deposit
	this.fund[0] = fund

	for (var month=1; month<duration; month++) {
	    if (month<13) {
		this.deposit[month] = this.deposit[month-1] -this.output
	    }

	    this.fund[month] = this.fund[month-1] + this.input
	    
	    // dividend
	    if (month%3 == 0) {
		console.warn("Dividend: " + this.fund[month]*0.009)
		account[month] += this.fund[month]*0.009
	    }
	    
	    // end of deposit. Interests
	    if (month == 13) {
		console.warn("Interest:" + deposit*0.025)
		account[month] += deposit * 0.025
	    }
	    
	}// for
	
    }// constructor

}// class CouponStrategy


/**
 * Returns an array with the interest updated according
 * to the euribor changes
 * @param {int} differential - constant 
 * @param {string} frequency - Update frequency (monthly, quarterly, yearly)
 * @param {string} type - Type of interest evolution (constant, exponential) 
 */
function setMonthlyInterest() {
    return []
}

/**
 * Returns the number of pending payments
 * @param {int} pending - Pending capital
 * @param {float} payment - The amount to pay periodically 
 * @param {float} interest - Monthly interest (example: 1.2/12)
 */
function updateNumberOfPayments(pending, payment, interest) {
    let N=-1* Math.log( 1 - pending*interest/(payment*100)) / (Math.log(1 + interest/100))
    return N
}

/**
 * Calculates the amortized capital 
 * @param {float} payment - The amount to pay periodically 
 * @param {float} interest - Monthly interest (example: 1.2/12)
 * @param {paidmonths} paidmonths - Number of monthly payments
 * @param {int} numberofpayments - Number of total payments (update 
 *              with any partial amortization)
 * @return {float} Amortized capital
 */
function amortized(payment, interest, paidmonths, numberofpayments) {
    let value = payment * (1 - Math.pow(1+interest/100.0, paidmonths-numberofpayments )) / (interest/100.0)
    return value
}

/**
 * Checks if the a partial amortization has to be 
 * done in the current month, according to the given rules
 * @param {int} currentMonth - 
 * @param {object} partial_amortization - 
 */
function performPartialAmortization(partial_amortization, currentMonth) {
    if (currentMonth == 0) {
	return false
    } 
    return ((partial_amortization.type == "periodic") &&
	    ((currentMonth % partial_amortization.period) == 0)) ||
	((partial_amortization.type == "extra") &&
	 (currentMonth == partial_amortization.month))
}


/**
 * Calculates how a mortgage evolves with the time
 * @param {int} mortgage - Initial 
 * @param {float} interest - Monthly interest
 * @param {int} term - Mortgage term (i.e.: number of total months)
 * @param {object} partial_amortization - 
 */
function calculate(mortgage, interest, term, partial_amortizations) {
    let N = term
    let currentMonth=1
    let capital = mortgage
    let payment = capital*interest/(100*(1 - Math.pow((1+interest/100), -term) ))
    let monthlyPayments = []
    let sumInterest = 0
    let sumSavings = 0
    let sumSavingsCPI = 0
    let sumPayments = 0
    let initialSavings = 0000
    let annualCPI = 0.02

    sumSavings = initialSavings
    sumSavingsCPI = initialSavings
    
    while (N>0) {
	let extra=0
	let a_n_new = amortized(payment, interest, currentMonth-1, currentMonth-1+N)
	// TODO: should a_n be calculated before performing amortizations
	let a_n = capital - a_n_new
	capital = a_n_new

	for (var amort in partial_amortizations) {
	    if (performPartialAmortization(partial_amortizations[amort], currentMonth)) {
		capital -= partial_amortizations[amort].amount
		N = updateNumberOfPayments(capital, payment, interest)
		extra += partial_amortizations[amort].amount

		// discount this amount from the savings
		sumSavingsCPI -= partial_amortizations[amort].amount
		sumSavings -= partial_amortizations[amort].amount
	    }
	}

	sumInterest+=payment - a_n;

	// savings
	sumSavingsCPI -= sumSavingsCPI*annualCPI/12
	sumSavingsCPI += savings
	sumSavings += savings

	sumPayments += payment + extra

	monthlyPayments.push({
	    month: currentMonth,
	    capital: capital,
	    payment: payment,
	    amortization: a_n,
	    interest:payment - a_n,
	    sumInterest: sumInterest,
	    sumSavings: sumSavings,
	    sumSavingsCPI: parseInt(sumSavingsCPI),
	    sumPayments: sumPayments,
	    extra: extra
	})

	N -= 1
	currentMonth +=1

    } // while

    return {payment:payment, months:monthlyPayments}

}// calculate

app.get('/', function (req, res) {
    let _mortgage
    let _interest
    let _monthlyInterest
    let _term
    let _amortization
    let _partial
    let _duration = 30
    let _account = Array(_duration).fill(0)
    
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

    var couponStrategyFund = new CouponStrategy(10000, 0, 0, _duration, _account)
    

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
