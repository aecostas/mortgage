'use strict';

class Property {
  /**
  *
  * @param Object expenses - Object with name, value, and type,
  *  where type in (monthly, yearly)
  */
  constructor(name, account, start, stop, incoming, price, expenses, decay=1) {
    this._name = name;
    this.account = account;
    this.month = 0;
    this.price = price;
    this._start = start;
    this._stop = stop;
    this.incoming = incoming;
	this.decay = decay;
    this.monthlyExpenses = expenses.filter((item) => { return item.type === 'monthly' });
    this.yearlyExpenses = expenses.filter((item) => { return item.type === 'yearly' });
  }

  get start() {
	  return this._start;
  }

  get stop() {
	  return this._stop;
  }

  get name() {
    return this._name;
  }

  set expenses(total) {
	  this._expenses = total;
  }

  get expenses() {
	  return this._expenses;
  }

  /**
  * Returns the price of this property at the current month
  * taking into account its devaluation function
  */
  getCurrentValue() {
	  if (this.isActive()) {
		return this.price*Math.pow(this.decay, (this.month - this.start)/12);
  	} else {
		return 0;
  	}
  }

  isActive() {
      if ((this.month < this._start) || (this.month > this._stop)) {
        return false;
      } else {
        return true;
      }
  }

  step() {
    this.month += 1;

    if (!this.isActive()) {
      return;
    } else if (this.month == this.start) {
      this.account.extract(this._name, 'Incoming payment', this.incoming);
    }

    for (let expense of this.monthlyExpenses) {
      if (expense.value != 0) {
        this.account.extract(this._name, expense.description, expense.value);
      }
    }

    if ((this.month % 12) === 0) {
      for (let expense of this.yearlyExpenses) {
        if (expense.value != 0) {
          this.account.extract(this._name, expense.description, expense.value);
        }
      }
    }

  }
}

module.exports = Property;
