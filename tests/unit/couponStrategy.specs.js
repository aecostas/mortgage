"use strict";

/// <reference path="../typings/mocha/mocha.d.ts"/>
/// <reference path="../typings/node/node.d.ts"/>
process.env.NODE_ENV = 'test';

var testCase = require('mocha').describe;
var pre = require('mocha').before;
var assertions = require('mocha').it;
var assert = require('assert');

const Mortgage = require('../../src/couponstrategy.js');

describe('<todo tests with coupon strategy>', function () {
    before(function() {
    });
});
