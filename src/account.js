const AccountMovement = require('./accountmovement.js');

class Account {

  /**
  * @param {string} name - Name of the account, just for reporting
  *                      purposes
  * @param {int} initial -  Initial amount on the account at the
  *                      moment of starting the simulation
  */
  constructor(name, initial) {
    this._name = name;
    this.month = 0;
    this.amount = [];
    this.amount[0] = initial;
    this._movements = [];
  }// constructor

  get name() {
    return this._name;
  }

  get value() {
    return this.amount[amount.lenth - 1];
  }

  /**
  * Simulates a new month. A new month in the account
  * means a copy of the previous amount.
  */
  step() {
    this.amount.push(this.amount[this.amount.length-1]);
    this.month += 1;
  };

  /**
  * Insert an amount of money in the account
  * @param {string} source - Origin of the amount
  * @param {string} concept - Description of the deposit
  * @param {int} amount - Amount of money to insert in the account
  */
  deposit(source, concept, amount) {
    this.amount[this.amount.length-1] += amount;
    this._movements.push(new AccountMovement(source, concept, amount,this.month));
  };

  /**
  * Gets an amount of money from the account
  * @param {string} target - Destination of the money
  * @param {string} concept - Description of this movement
  * @param {int} amount - Amount of money to extract from the account
  */
  extract(target, concept, amount) {
    this.amount[this.amount.length-1] -= amount;
    this._movements.push(new AccountMovement(target, concept, -amount, this.month));
  };

  /**
  * Gets the values of the account from the beginning of the
  * simulation
  * @return {int[]} Simulated values from the beginning of the simulation
  */
  values() {
    return this.amount
  };

  /**
  * Gets the movements on this account, bot extractions and deposits,
  * @return {Array<AccountMovement>} Object including source, concept, amount and relative month on the simulation
  */
  get movements() {
    return this._movements
  };
}

// eslint-disable-next-line no-undef
module.exports = Account;

