"use strict";

class Account {
    constructor(name, initial) {
	this.name = name;
	this.month=0;
	this.amount = [];	    
	this.amount[0] = initial;
	this.movements = [];
    }// constructor

    step() {
	this.amount.push(this.amount[this.amount.length-1]);
	this.month +=1;
    }
    
    deposit(source, concept, amount) {
	this.amount[this.amount.length-1] += amount;
	this.movements.push({source:source, concept:concept, amount:amount, month:this.month});
    }

    extract(target, concept, amount) {
	this.amount[this.amount.length-1] -= amount;
	this.movements.push({source:target, concept:concept, amount:-amount, month:this.month});
    }

    values() {
	return this.amount
    }
}

module.exports = Account

// TODO: save movements and indicate the concept
