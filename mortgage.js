"use strict";

class Mortgage {

    constructor(mortgage, interest, term, partial_amortizations, account) {
	this.N = term;
	this.currentMonth=1;
	this.interest = interest;
	this.capital = mortgage;
	this.payment = this.capital*interest/(100*(1 - Math.pow((1+interest/100), -term) ));
	console.warn("Calculated payment: " + this.payment);
	console.warn("Term: "+ term);
	this.monthlyPayments = []
	this.sumInterest = 0
	this.sumPayments = 0
	this.annualCPI = 0.02
	this.account = account
	    this.status = "OPEN";
	this.name = "Mortgage";
    }// constructor


    /**
     * Returns an array with the interest updated according
     * to the euribor changes
     * @param {int} differential - constant 
     * @param {string} frequency - Update frequency (monthly, quarterly, yearly)
     * @param {string} type - Type of interest evolution (constant, exponential) 
     */
    setMonthlyInterest() {
	return []
    }


    /**
     * Returns the number of pending payments
     * @param {int} pending - Pending capital
     * @param {float} payment - The amount to pay periodically 
     * @param {float} interest - Monthly interest (example: 1.2/12)
     */
    updateNumberOfPayments(pending, payment, interest) {
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
    amortized(payment, interest, paidmonths, numberofpayments) {
	let value = payment * (1 - Math.pow(1+interest/100.0, paidmonths-numberofpayments )) / (interest/100.0)
	return value
    }
    
    /**
     * Checks if the a partial amortization has to be 
     * done in the current month, according to the given rules
     * @param {int} currentMonth - 
     * @param {object} partial_amortization - 
     */
    performPartialAmortization(partial_amortization, currentMonth) {
	if (currentMonth == 0) {
	    return false
	}
	return ((partial_amortization.type == "periodic") &&
		((currentMonth % partial_amortization.period) == 0)) ||
	    ((partial_amortization.type == "extra") &&
	     (currentMonth == partial_amortization.month))
    }

    step() {
	if (this.status=="FINISHED") return;

	let extra=0
	let a_n_new = this.amortized(this.payment, this.interest, this.currentMonth-1, this.currentMonth-1 + this.N)
	// TODO: should a_n be calculated before performing amortizations
	let a_n = this.capital - a_n_new
	this.capital = a_n_new

	for (var amort in this.partial_amortizations) {
	    if (performPartialAmortization(this.partial_amortizations[amort], this.currentMonth)) {
		this.capital -= this.partial_amortizations[amort].amount
		this.N = updateNumberOfPayments(this.capital, this.payment, this.interest)
		extra += this.partial_amortizations[amort].amount

		// discount this amount from the savings
		this.account.extract(this.name, "Partial amortization", this.partial_amortizations[amort].amount)
	    }
	}

	this.sumInterest+=this.payment - a_n;

	this.sumPayments += this.payment + extra

	this.monthlyPayments.push({
	    month: this.currentMonth,
	    capital: this.capital,
	    payment: this.payment,
	    amortization: a_n,
	    interest: this.payment - a_n,
	    sumInterest: this.sumInterest,
	    sumPayments: this.sumPayments,
		    extra: extra
		    });
	
	this.account.extract(this.name, "Monthly mortgage payment", this.payment)

	this.N -= 1

	if (this.N == 0) {
	    this.status = "FINISHED"
	}

	this.currentMonth +=1
    }

    values() {
	return this.monthlyPayments	
    }
}// class Mortgage

module.exports = Mortgage