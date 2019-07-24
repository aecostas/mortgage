"use strict";

class Mortgage {

  constructor(mortgage, interest, start, term, partial_amortizations, account) {
    this.STATUS_OPEN = 0;
    this.STATUS_FINISHED = 1;

    this.N = term;
    this.currentMonth = 0;
    this.interest = interest;
    this.capital = mortgage;
    this.start = start;
    this._payment = this.capital * interest / (100 * (1 - Math.pow((1 + interest / 100), -term)));
    this.monthlyPayments = []
    this.sumInterest = 0
    this.sumPayments = 0
    this.annualCPI = 0.02
    this.account = account
    this._status = this.STATUS_OPEN;
    this.partial_amortizations = partial_amortizations;
    this._name = "Mortgage";
  }// constructor

  get name() {
    return this._name;
  }

  /**
  * Returns an array with the interest updated according
  * to the euribor changes
  * @param {int} differential - constant
  * @param {string} frequency - Update frequency (monthly, quarterly, yearly)
  * @param {string} type - Type of interest evolution (constant, exponential)
  */
  setMonthlyInterest() {
    return [];
  }

  /**
  * Returns the number of pending payments
  * @param {int} pending - Pending capital
  * @param {float} payment - The amount to pay periodically
  * @param {float} interest - Monthly interest (example: 1.2/12)
  */
  updateNumberOfPayments(pending, payment, interest) {
    let N = -1 * Math.log(1 - pending * interest / (payment * 100)) / (Math.log(1 + interest / 100));
    return Math.ceil(N);
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
    let value = payment * (1 - Math.pow(1 + interest / 100.0, paidmonths - numberofpayments)) / (interest / 100.0)
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
    this.currentMonth += 1;

    if (this.currentMonth < this.start) {
      return;
    }

    if (this._status === this.STATUS_FINISHED) {
      this.capital = 0;
      return;
    }

    let extra = 0
    let a_n_new = this.amortized(this._payment, this.interest, this.currentMonth, this.currentMonth + this.N)
    // TODO: should a_n be calculated before performing amortizations
    let a_n = this.capital - a_n_new
    this.capital = a_n_new

    for (let amortization of this.partial_amortizations) {
      if (this.performPartialAmortization(amortization, this.currentMonth)) {
        this.capital -= amortization.amount
        let tempN = this.updateNumberOfPayments(this.capital, this._payment, this.interest);
        this.N = tempN;
        extra += amortization.amount;

        // discount this amount from the savings
        this.account.extract(this._name, "Partial amortization", amortization.amount)
      }
    }

    this.sumInterest += this._payment - a_n;

    this.sumPayments += this._payment + extra;

    this.monthlyPayments.push({
      month: this.currentMonth,
      capital: this.capital,
      payment: this._payment,
      amortization: a_n,
      interest: this._payment - a_n,
      sumInterest: this.sumInterest,
      sumPayments: this.sumPayments,
      extra: extra
    });

    this.account.extract(this._name, "Monthly mortgage payment", this._payment)

    this.N -= 1
    if (this.N == 0) {
      this._status = this.STATUS_FINISHED;
    }

  }

  values() {
    return this.monthlyPayments;
  }

  getPendingCapital() {
    if (this.currentMonth < this.start) {
      return 0;
    } else {
      return this.capital;
    }
  }

  /**
  * Returns the calculated monthly payment
  * for this mortgage
  */
  get payment() {
  }

}// class Mortgage

module.exports = Mortgage

  // TODO: risk analysis of the mortgage
