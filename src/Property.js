'use strict';

class Property {
    /**
     *
     * @param Object expenses - Object with name, value, and type, 
     *  where type in (monthly, yearly)
     */
    constructor(name, account, price, expenses) {
	this._name = name;
	this.account = account;
	this.month = 0;
	this.price = price;
	this.monthlyExpenses = expenses.filter((item) => { return item.type === 'monthly' });
	this.yearlyExpenses = expenses.filter((item) => { return item.type === 'yearly' });
	console.warn(this.yearlyExpenses);
    }

    get name() {
	return this._name;
    }

    step() {
	this.month += 1;

	for (let expense of this.monthlyExpenses) {
	    this.account.extract(this._name, expense.description, expense.value);
	}

	if ((this.month % 12) === 0) {
	    for (let expense of this.yearlyExpenses) {
		this.account.extract(this._name, expense.description, expense.value);
	    }
	}
    }
}

module.exports = Property;
