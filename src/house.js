'use strict';

const Property = require('./Property.js');

class House extends Property{
    /**
     *
     * @param Object expenses - Object with name, value, and type, 
     *  where type in (monthly, yearly)
     */
    constructor(name, account, price, expenses) {
	// insurance, community, general, energy, water, sewerage
	super(name, account, price, expenses);
    }

}

module.exports = House;
