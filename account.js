"use strict";

class Account {

    /**
     * @param {string} name - Name of the account, just for reporting
     *                      purposes
     * @param {int} initial -  Initial amount on the account at the 
     *                      moment of starting the simulation
     */
    constructor(name, initial) {
	this.name = name;
	this.month=0;
	this.amount = [];	    
	this.amount[0] = initial;
	this.movements = [];
    }// constructor

    /**
     * Simulates a new month. A new month in the account
     * means a copy of the previous amount.
     */
    step() {
	this.amount.push(this.amount[this.amount.length-1]);
	this.month +=1;
    }
    

    /**
     * Insert an amount of money in the account
     * @param {string} source - Origin of the amount
     * @param {string} concept - Description of the deposit
     * @param {int} amount - Amount of money to insert in the account
     */
    deposit(source, concept, amount) {
	this.amount[this.amount.length-1] += amount;
	this.movements.push({source:source, concept:concept, amount:amount, month:this.month});
    }

    /**
     * Gets an amount of money from the account
     * @param {string} target - Destination of the money
     * @param {string} concept - Description of this movement
     * @param {int} amount - Amount of money to extract from the account
     */
    extract(target, concept, amount) {
	this.amount[this.amount.length-1] -= amount;
	this.movements.push({source:target, concept:concept, amount:-amount, month:this.month});
    }

    /**
     * Gets the values of the account from the beginning of the
     * simulation
     * @return {int[]} Simulated values from the beginning of the simulation
     */
    values() {
	return this.amount
    }
}

module.exports = Account

// TODO: return values with concepts
