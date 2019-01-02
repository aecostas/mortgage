process.env.NODE_ENV = 'test';

const assert = require('assert');
const sinon = require('sinon');

const Job = require('../../src/job.js');
const Account = require('../../src/account.js');

describe('Job', () => {

    it('Transfer salary', () => {
        let salary = 1000;
        let firstMonth = 0;
        let account = new Account("Account", 0);
        let job = new Job('primary job', account, salary, firstMonth);
        let spy = sinon.spy(account, 'deposit');

        job.step();
        assert.equal(spy.firstCall.lastArg, salary);        
    });

    it('Job not active yet', () => {
        let salary = 1000;
        let firstMonth = 10;
        let account = new Account("Account", 0);
        let job = new Job('primary job', account, salary, firstMonth);
        let spy = sinon.spy(account, 'deposit');

         job.step();
        assert.equal(spy.firstCall, null);        
    })
});
