"use strict";

/**
 * Simulates a fund fed from a deposit.
 * The fund shares dividends
 */
class CouponStrategy {

    /**
     * @param {int} deposit Capital in the deposit when the simulation starts
     * @param {int} duration Number of months of the deposit. At the end, the
     *                       interest will be paid
     * @param {int} initialmonth The month when the simulation starts
     * @param {Account} account The bank account where the dividends and
     *                          the interests are inserted
     * @param {float} taxes Taxes to pay to government on the benefits of
     *                      the capital
     * @param {float} dividend Percentage of the capital of the fund
     * @param {float} interest Percentage of the capital deposit to pay
     *                         at the end of the deposit
     * 
     */
    constructor(deposit, duration, fund, initialmonth, account, taxes, dividend, interest) {
	this.interest = interest;
	this.deposit = [];
	this.fund = [];
	this.output = deposit/duration;
	this.input = deposit/duration - (deposit/duration)*taxes.suscription;
	this.deposit[0] = deposit;
	this.fund[0] = fund;
	this.month=0;
	this.account= account;
	this.vat = taxes.vat;
	this.div = dividend;
	this._name = "CouponStrategy";
	this.monthPayInterest = duration + 1
    }// constructor

    get name() {
	return this._name;
    }

    //    getFundIncrement()

    /**
     * Simulates a new month, taking into account if a new dividend 
     * or the interests should be paid
     */
    step() {
	this.month +=1;
	this.fund.push(this.fund[this.month-1]);

	if (this.month < this.monthPayInterest) {
	    this.deposit[this.month] = this.deposit[this.month-1] - this.output;
	    this.fund[this.month] += this.input;
	}

	// TODO: update fund

	// dividend
	if (this.month%3 == 0) {
	    this.account.deposit(this._name, "Coupon strategy fund dividend", this.fund[this.month]*this.div*(1-this.vat))
	}

	// end of deposit. Interest
	if (this.month == this.monthPayInterest) {
	    this.account.deposit(this._name, "Coupon strategy deposit interests", this.deposit[0] * this.interest)
	}
    }// step

    /**
     * Return current value of the fund
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

// TODO: simulate variation of participation price
//       indicate the periodicity of dividends
