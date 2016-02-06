"use strict";

/// <reference path="../typings/mocha/mocha.d.ts"/>
/// <reference path="../typings/node/node.d.ts"/>
process.env.NODE_ENV = 'test';

var testCase = require('mocha').describe;
var pre = require('mocha').before;
var assertions = require('mocha').it;
var assert = require('assert');

const Account = require('../../src/account.js');

describe('Account with initial amount', function () {
	let account;
	before(function() {
		account = new Account("Account", 1000);
	    });

	it('Get values at the begining', function() {
		let values = account.values();
		assert.deepEqual(values, [1000]);
	    });

	it('Get values after several iterations', function() {
		let iterations = 2;
		for (let i=0; i< iterations; i++) {
		    account.step()
		}
		let values = account.values();
		assert.deepEqual(values, [1000,1000,1000]);
	    });

	it('Deposit', function() {
		account.deposit("FUND1", "dividend", 1234);
		let values = account.values();
		assert.deepEqual(values, [1000,1000,2234]);
	    });
	
    });


