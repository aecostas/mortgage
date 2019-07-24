const Property = require('./Property.js');

class Car extends Property{
  constructor(name, account, start, stop, incoming, price, expenses, decay) {
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
        "type": "monthly",
        "value": expenses['rent'],
        "description": "rent"
      });

    expensesByType.push(
      {
        "type": "yearly",
        "value": expenses['insurance'],
        "description": "Insurance"
      });

    super(name, account, start, stop, incoming, price, expensesByType, decay);
  }

  getCurrentPrice() {
    if (this.isActive()) {
      return this.price;
    } else {
      return 0;
    }
  }
}

module.exports = Car;
