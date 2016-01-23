"use strict";

class Account {
    constructor(initial) {
	this.amount = []
	this.amount[0] = initial
    }

    step() {
	this.amount.push(this.amount[this.amount.length-1])
    }
    
    deposit(amount) {
	this.amount[this.amount.length-1] += amount
    }

    extract(amount) {
	this.amount[this.amount.length-1] -= amount
    }

    values() {
	return this.amount
    }
}

module.exports = Account

// TODO: save movements and indicate the concept
