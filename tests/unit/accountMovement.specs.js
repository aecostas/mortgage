process.env.NODE_ENV = 'test';

var assert = require('assert');

const AccountMovement = require('../../src/accountmovement.js');

describe('Movements', function () {
    let movement;
    before(function() {
	movement = new AccountMovement("the other peer", "Car", 10000, 23);
    });
    
    it('Get values at the begining', function() {
	assert.equal(movement.peer, "the other peer");
	assert.equal(movement.concept, "Car");
	assert.equal(movement.amount, 10000);
	assert.equal(movement.month, 23);
    });

});
