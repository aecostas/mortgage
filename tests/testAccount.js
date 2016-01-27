var testCase = require('mocha').describe;
var pre = require('mocha').before;
var assertions = require('mocha').it;
var assert = require('assert');

it('Array', function() {	
	it('#indexOf()', function() {
		assertions('should return -1 when not present', function() {
			assert.equal([1,2,3].indexOf(4), -1);
		    });
	    });
    });
