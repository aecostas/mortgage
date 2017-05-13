'use strict';

class Job {
    constructor(name, account, salary) {
	this._name = name;
	this.account = account;
	this.month = 0;
	this.salary = salary;
    }

    get name() {
	return this._name;
    }

    step() {
	this.month += 1;
	this.account.deposit(this._name, "Monthly salary", this.salary);
    }    
}

module.exports = Job;
