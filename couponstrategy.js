"use strict";

class CouponStrategy {
    constructor(deposit, fund, initialmonth, account, taxes, dividend) {
	this.deposit = []
	this.fund = []
	this.output = deposit/12
	this.input = deposit/12 - (deposit/12)*0.05
	this.deposit[0] = deposit
	this.fund[0] = fund
	this.month=0
	this.account= account
	this.taxes = taxes
	this.div = dividend
	    this.name = "CouponStrategy"
    }

    step() {
	this.month +=1
	this.fund.push(this.fund[this.month-1])

	if (this.month<13) {
	    this.deposit[this.month] = this.deposit[this.month-1] - this.output
	    this.fund[this.month] += this.input
	}

	// dividend
	if (this.month%3 == 0) {
	    this.account.deposit(this.name, "Coupon strategy fund dividend", this.fund[this.month]*this.div*(1-this.taxes))
	}

	// end of deposit. Interests
	if (this.month == 13) {
	    this.account.deposit(this.name, "Coupon strategy deposit interests", this.deposit[0] * 0.025)
	}
    }

    /**
     * Return current value
     *
     */
    current() {
	return this.fund[fund.length - 1]
    }

    /**
     * Return all the simulated values 
     * from the first month
     */
    values() {
	return this.fund
    }

}// class CouponStrategy

module.exports = CouponStrategy
