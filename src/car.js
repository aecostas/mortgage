'use strict';

const Property = require('./Property.js');

class Car extends Property{
  constructor(name, account, start, incoming, price, expenses) {
    let expensesByType = [];

    expensesByType.push(
      {
        "type": "yearly",
        "value": expenses['taxes'],
        "description": "Taxes"
      });

    expensesByType.push(
      {
        "type": "yearly",
        "value": expenses['general'],
        "description": "General expenses"
      });

    expensesByType.push(
      {
        "type": "monthly",
        "value": expenses['fuel'],
        "description": "fuel"
      });

    expensesByType.push(
      {
        "type": "yearly",
        "value": expenses['insurance'],
        "description": "Insurance"
      });

    super(name, account, start, incoming, price, expensesByType);
  }

  getCurrentPrice() {
    return this.price;
  }
}

module.exports = Car;
