"use strict";
var express = require('express');
var app = express();
var json = require('express-json');

app.use(json())
app.use(express.static('public'))

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
	    }
	}

	sumInterest+=payment - a_n;

	monthlyPayments.push({
	    month: currentMonth,
	    capital: capital,
	    payment: payment,
	    amortization: a_n,
	    interest:payment - a_n,
	    sumInterest: sumInterest,
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
    let _sumacuotas = 0

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

    // let partial = {type: "periodic", period: 3, amount: 1000}
    // let partial2 = {type: "extra", month: 10, amount: 1000}
    // let partial3 = {}

    _monthlyInterest = _interest/12

    let _payments = calculate(_mortgage, _monthlyInterest, _term, _partial)

    let total = _payments.months.reduce(function(prev, current, index, vector) {
	return {payment: prev.payment + current.payment + current.extra}
    });

    console.log ("Cuota: " + _payments.payment)
    console.log ("Hipoteca: " + _mortgage)
    console.log ("Pagado al banco: " + total.payment)
    console.log ("Intereses: " + (total.payment - _mortgage))

    res.send(_payments);
});

var server = app.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

// TODO: 
//    * REST API
//    * modelar liquidar de golpe (cuando el capital pendiente sea igual a una cantidad dada)
