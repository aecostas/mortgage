'use strict';
const Property = require('./Property.js');

class Life extends Property {
  constructor(account, expenses) {
    let expensesByType = [];

    expensesByType.push(
      {
        "type": "yearly",
        "value": expenses['holidays'],
        "description": "Holidays"
      });

    expensesByType.push(
      {
        "type": "monthly",
        "value": expenses['general'],
        "description": "General expenses"
      });

    expensesByType.push(
      {
        "type": "monthly",
        "value": expenses['food'],
        "description": "food"
      });

    super('Life', account, 0, 0, 0, expensesByType);
  }

  getCurrentPrice() {
    return 0;
  }

}

module.exports = Life;
