process.env.NODE_ENV = 'test';

const assert = require('assert');
const sinon = require('sinon');

const Account = require('../../src/account.js');
const Deposit = require('../../src/deposit.js');

describe('Deposit with interest payment at the end', function () {

    it('Should move the initial amount from the account to the deposit', () => {
        let account = new Account("Account", 20000);
        let initialAmount = 10000;
        let startMonth = 1;
        let duration = 12;
        let interest = 0.01;
        let spy = sinon.spy(account, 'extract');
        let deposit = new Deposit(
            'deposit name', 
            account, 
            initialAmount, 
            startMonth, 
            duration, 
            interest,
            Deposit.INTEREST_END);
        deposit.step();
        assert.equal(spy.firstCall.lastArg, initialAmount);
    });

    it('Should move the initial amount to the account at the end', () => {
        let account = new Account("Account", 20000);
        let initialAmount = 10000;
        let startMonth = 1;
        let duration = 12;
        let interest = 0.01;
        let spy = sinon.spy(account, 'deposit');
        let deposit = new Deposit('deposit name', account, initialAmount, startMonth, duration, interest, Deposit.INTEREST_END);
        let steps = 13;

        while (steps--) {
            deposit.step();
        }

        let callForDeposit = spy.args.filter(arg => arg[1] === 'Deposit ends');
        assert.equal(callForDeposit[0][2], initialAmount);
    });
    
    it('Should move interests at the end', () => {
        let account = new Account("Account", 20000);
        let initialAmount = 10000;
        let startMonth = 1;
        let duration = 12;
        let interest = 0.01;
        let spy = sinon.spy(account, 'deposit');
        let deposit = new Deposit('deposit name', account, initialAmount, startMonth, duration, interest, Deposit.INTEREST_END);
        let steps = 13;

        while (steps--) {
            deposit.step();
        }

        let callForDeposit = spy.args.filter(arg => arg[1] === 'Deposit interests');
        assert.equal(callForDeposit[0][2], 81);
    });

});