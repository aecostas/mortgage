"use strict";

/// <reference path="../typings/mocha/mocha.d.ts"/>
/// <reference path="../typings/node/node.d.ts"/>
process.env.NODE_ENV = 'test';

var testCase = require('mocha').describe;
var pre = require('mocha').before;
var assertions = require('mocha').it;
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
