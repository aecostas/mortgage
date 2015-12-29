"use strict";

function updateNumberOfPayments(pending, payment) {
    let N=-1* Math.log( 1 - pending*interes/(payment*100)) / (Math.log(1 + interes/100))
    return N
}

function amortizado(cuota, interes, mesespagados, numberofpayments) {
    let value = cuota * (1 - Math.pow(1+interes/100.0, mesespagados-numberofpayments )) / (interes/100.0)
    return value
}

function calculate(hipoteca, interes, plazo) {
    let N = plazo
    let pagadas=1
    let currentMonth=0
    let capital = hipoteca

    let cuota = capital*interes/(100*(1 - Math.pow((1+interes/100), -plazo) ))

    while (N>0) {
	let a_n_new = amortizado(cuota, interes, pagadas-1, pagadas-1+N)
	let a_n = capital - a_n_new
	pagadas += 1
	capital = a_n_new
	if ((currentMonth!=0) && ((currentMonth % 3) == 0)) {
            let amount = 0
            let prev = N
            capital -= amount
            sumacuotas += amount
            N = updateNumberOfPayments(capital, cuota)
	}

	sumacuotas += cuota
	N -= 1
	console.log(`${currentMonth} Capital: ${capital}\tCuota: ${cuota}\tAmortizacion: ${a_n}`)
	currentMonth +=1
    } // while
    return cuota

}// calculate


let hipoteca = 100000
let interes = 1.2/12
let plazo = 360
let sumacuotas = 0

let cuota = calculate(hipoteca, interes, plazo)

console.log ("Cuota: " + cuota)
console.log ("Hipoteca: " + hipoteca)
console.log ("Pagado al banco: " + sumacuotas)
console.log ("Intereses: " + (sumacuotas - hipoteca))

// TODO: 
//    * translate to english
//    * model types of partial amortizations (periodic, punctual, etc) and decouple it from while
//    * calculate returns json with monthly payments
