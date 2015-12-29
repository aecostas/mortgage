"use strict";

function updateNumberOfPayments(pending, payment, interest) {
    let N=-1* Math.log( 1 - pending*interest/(payment*100)) / (Math.log(1 + interest/100))
    return N
}

function amortizado(payment, interest, paidmonths, numberofpayments) {
    let value = payment * (1 - Math.pow(1+interest/100.0, paidmonths-numberofpayments )) / (interest/100.0)
    return value
}

function calculate(mortgage, interest, term) {
    let N = term
    let currentMonth=1
    let capital = mortgage
    let payment = capital*interest/(100*(1 - Math.pow((1+interest/100), -term) ))
    let monthlyPayments = []

    while (N>0) {
	let extra=0
	let a_n_new = amortizado(payment, interest, currentMonth-1, currentMonth-1+N)
	let a_n = capital - a_n_new
	capital = a_n_new
	if ((currentMonth!=0) && ((currentMonth % 3) == 0)) {
            let amount = 0
            capital -= amount
            N = updateNumberOfPayments(capital, payment, interest)
	    extra=amount
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

let _payments = calculate(_mortgage, _interest, _plazo)



let total = _payments.months.reduce(function(prev, current, index, vector) {
    return {payment: prev.payment + current.payment + current.extra}
});

console.log(_payments)
console.log ("Cuota: " + _payments.payment)
console.log ("Hipoteca: " + _mortgage)
console.log ("Pagado al banco: " + total.payment)
console.log ("Intereses: " + (total.payment - _mortgage))

// TODO: 
//    * model types of partial amortizations (periodic, punctual, etc) and decouple it from while
//    * REST API
//    * documentation!!
