'use strict';

var colors = require('colors');
const Account = require('./account.js');

class ConsoleReport {

  report(modules, assets, debt, years) {
    modules.forEach(function(module) {
      if (module instanceof Account) {
        let values = module.values();
        let prev = parseInt(values[0]);
        let currentYear = 2016;

        for (let year=0; year < years; year++) {
          console.warn('='.repeat(25)+' '+(currentYear + year)+' '+'='.repeat(25));

          for (let month = 1; month <= 12; month++) {
            let currentMonth = year*12 + month;
            let current = parseInt(values[currentMonth]);
            let diff = current - prev;
            let diffOutput;

            if (diff < 0) {
              diffOutput = colors.red(diff);
            } else {
              diffOutput = diff;
            }

            console.warn(currentMonth + ' ' + current + ' ' + diffOutput + ' --- ' + assets[currentMonth] +' --- ' + debt[currentMonth]);
            prev = current;
          }
        }
      }
    });
  }

}

module.exports = ConsoleReport;
