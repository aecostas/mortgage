"use strict";

var eslint = require('gulp-eslint');
var util = require('gulp-util');

var JS_FILES = './src/*.js';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');


gulp.task('lint', function () {
    return gulp.src([JS_FILES])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('pre-test', function () {
	return gulp.src(['src/*.js'])
	    // Covering files
	    .pipe(istanbul())
	    // Force `require` to return covered files
	    .pipe(istanbul.hookRequire());
    });


gulp.task('test', ['pre-test'], function () {
	return gulp.src(['tests/auto/test*.js'], { read: false })
	    .pipe(mocha())
	    .pipe(istanbul.writeReports())
	.on('error', util.log);
    });

//gulp.task('test', function () { 
//    .pipe(istanbul({includeUntested: true}))
//    .on('finish', function () { 
//	    gulp.src('./assets/js/test/test.js') 
//	}); 
//    });
