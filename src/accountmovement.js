/**
 * Represent a movement in a bank account
 *
 */
class AccountMovement {

    /**
     * @param {string} peer - Target or source of this movement
     * @param {string} concept - Description of this movement
     * @param {int} amount - Amount of this movement
     * @param {month} month - Relative month of the simulation where this movement wwas done
     */
    constructor(peer, concept, amount, month) {
	this._peer = peer;
	this._concept = concept;
	this._amount = amount;
	this._month = month;
    }

    /**
     * Gets 
     */
    get peer() {
	return this._peer
    }

    /**
     * Gets the concept of this movement
     */
    get concept() {
	return this._concept
    }

    /**
     * Gets the moved amount
     */
    get amount() {
	return this._amount
    }

    /**
     * Gets the month where this movement was made
     */
    get month() {
	return this._month
    }
}

module.exports = AccountMovement;