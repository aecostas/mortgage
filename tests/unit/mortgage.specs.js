process.env.NODE_ENV = 'test';

var testCase = require('mocha').describe;
var pre = require('mocha').before;
var assertions = require('mocha').it;
var assert = require('assert');

const Mortgage = require('../../src/mortgage.js');
const Account = require('../../src/account.js');

describe('Evaluate payments for different mortgages', function () {
	it.skip('', function () {
	})
});

describe('Mortgage with partial amortizations extra', function () {
	let amortization = [{type: "extra", month: 10, amount: 20000}]
	let account;
	let mortgage;

	before(function() {
		account = new Account("Main account", 0);
		mortgage = new Mortgage(100000, 1.2/12, 0, 30*12, amortization, account);
	});

	it('Get values after first iteration', function() {
		mortgage.step() // month 0
		mortgage.step() // month 1
		let values = mortgage.values();

		assert.equal(mortgage.values()[1].capital, 99769.09130588078);
		assert.equal(mortgage.values()[1].payment, 330.90869411922023);
		assert.equal(mortgage.values()[1].amortization, 230.90869411922176 );
		assert.equal(mortgage.values()[1].interest, 99.99999999999847);
		assert.equal(mortgage.values()[1].sumInterest, 430.9086941192187);
		assert.equal(mortgage.values()[1].sumPayments, 661.8173882384405);
		assert.equal(mortgage.values()[1].extra, 0);
	});

	it.skip('Check status of the mortgage ', function() {
		for (let i=0; i<272; i++) {
			mortgage.step()
			assert.equal(mortgage.status, "OPEN");
		}// for
		for  (let i=0; i<4; i++) {
			mortgage.step()
		}
		assert.equal(mortgage.status, "FINISHED");

	});

	it.skip('Evaluate data for last payment', function() {
	})
})

describe('Mortgage without partial amortizations', function () {
	let mortgage;
	let account;

	before(function() {
		account = new Account("Main account", 0);
		mortgage = new Mortgage(100000, 1.2/12, 0, 30*12, {}, account);
		//mortgage, interest, start, term, partial_amortizations, account
	});

	it('Get values after first iteration', function() {
		mortgage.step(); // month 0
		mortgage.step(); // month 1
		//let values = mortgage.values();
		assert.equal(mortgage.values()[1].capital, 99769.09130588078);
		assert.equal(mortgage.values()[1].payment, 330.90869411922023);
		assert.equal(mortgage.values()[1].amortization, 230.90869411922176 );
		assert.equal(mortgage.values()[1].interest, 99.99999999999847);
		assert.equal(mortgage.values()[1].sumInterest, 430.9086941192187);
		assert.equal(mortgage.values()[1].sumPayments, 661.8173882384405);
		assert.equal(mortgage.values()[1].extra, 0);
	});

	it.skip('Check status of the mortgage ', function() {
		let mortgage2 = new Mortgage(10000, 0.1, 0, 100, {} ,account);
		for (let i=0; i<95; i++) {
			mortgage2.step()
		}// for

		assert(mortgage2.status, "OPEN");
		for (let i=0; i<10; i++) {
			mortgage2.step()
		}// for

		assert(mortgage2.status, "FINISHED");
	});

	it.skip('Evaluate data for last payment', function() {
	})

});
