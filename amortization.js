"use strict";

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
    return ((partial_amortization.type == "periodic") &&
	    (currentMonth!=0)  &&
	    ((currentMonth % partial_amortization.period) == 0)) ||
	((partial_amortization.type == "extra") &&
	 (currentMonth!=0) && 
	 (currentMonth == partial_amortization.month))
}


/**
 * Calculates how a mortgage evolves with the time
 * @param {int} mortgage - Initial 
 * @param {float} interest - Monthly interest
 * @param {int} term - Mortgage term (i.e.: number of total months)
 * @param {object} partial_amortization - 
 */
function calculate(mortgage, interest, term, partial_amortization) {
    let N = term
    let currentMonth=1
    let capital = mortgage
    let payment = capital*interest/(100*(1 - Math.pow((1+interest/100), -term) ))
    let monthlyPayments = []

    while (N>0) {
	let extra=0
	let a_n_new = amortized(payment, interest, currentMonth-1, currentMonth-1+N)
	let a_n = capital - a_n_new
	capital = a_n_new
	if (performPartialAmortization(partial_amortization, currentMonth)) {
	    capital -= partial_amortization.amount
	    N = updateNumberOfPayments(capital, payment, interest)
	    extra=partial_amortization.amount
	}

	N -= 1
	monthlyPayments.push({month: currentMonth, capital: capital, payment: payment, amortization: a_n, extra: extra})
	currentMonth +=1
    } // while

    return {payment:payment, months:monthlyPayments}

}// calculate

let _mortgage = 100000
let _interest = 1.2/12
let _plazo = 360
let _sumacuotas = 0

let partial = {type: "periodic", period: 4, amount: 1000}
let partial2 = {type: "extra", month: 10, amount: 1000}

let _payments = calculate(_mortgage, _interest, _plazo, partial)

let total = _payments.months.reduce(function(prev, current, index, vector) {
    return {payment: prev.payment + current.payment + current.extra}
});

console.log(_payments)
console.log ("Cuota: " + _payments.payment)
console.log ("Hipoteca: " + _mortgage)
console.log ("Pagado al banco: " + total.payment)
console.log ("Intereses: " + (total.payment - _mortgage))

// TODO: 
//    * REST API
//    * modelar liquidar de golpe (cuando el capital pendiente sea igual a una cantidad dada)
