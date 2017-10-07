'use strict';

class Car {
  constructor(name, account, price, taxes, expenses, fuel, insurance) {
    this._name = name;
    this.account = account;
    this.month = 0;
    this.price = price;
    this.taxes = taxes;         // annual
    this.expenses = expenses;   // annual
    this.fuel = fuel;           // monthly
    this.insurance = insurance; // annual
  }

  get name() {
    return this._name;
  }

  step() {
    this.month += 1;
    this.account.extract(this._name, "Fuel", this.fuel);

    if ((this.month % 12) === 0) {
      this.account.extract(this._name, "Taxes", this.taxes);
      this.account.extract(this._name, "Expenses", this.expenses);
      this.account.extract(this._name, "Insurance", this.insurance);
    }
  }
}

module.exports = Car;
