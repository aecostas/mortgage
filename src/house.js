'use strict';

const Property = require('./Property.js');

class House extends Property {
/**
  * @param Object expenses - Object with name, value, and type,
  *  where type in (monthly, yearly)
  */
  constructor(name, account, start, stop, incoming, price, expenses) {
    let expensesByType = [];
    expensesByType.push(
      {
        "type": "yearly",
        "value": expenses['insurance'],
        "description": "Insurance"
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
        "value": expenses['community'],
        "description": "community"
      });
    expensesByType.push(
      {
        "type": "monthly",
        "value": expenses['energy'],
        "description": "Energy"
      });
    expensesByType.push(
      {
        "type": "monthly",
        "value": expenses['water'],
        "description": "Water"
      });
    expensesByType.push(
      {
        "type": "yearly",
        "value": expenses['sewerage'],
        "description": "100"
      });

    super(name, account, start, stop, incoming, price, expensesByType);
  }

  getCurrentPrice() {
    if (this.isActive()) {
      return this.price;
    } else {
      console.warn('current price is zero');
      return 0;
    }
  }

}

module.exports = House;
