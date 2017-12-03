'use strict';

var colors = require('colors');
var Table = require('cli-table');

const Account = require('./account.js');
const Mortgage = require('./mortgage.js');

class ConsoleReport {

	report(modules, assets, debt, years, currentYear) {
		var table = new Table({
			head: ['Month', 'Account', 'Diff', 'Assets', 'Debt']
		});

		modules.forEach(function(module) {
			if (module instanceof Account) {
				let values = module.values();
				let prev = parseInt(values[0]);

				for (let year=0; year < years; year++) {

					for (let month = 1; month <= 12; month=month+12) {
						let currentMonth = year*12 + month;
						let currentAccountMoney = parseInt(values[currentMonth]);
						let diff = currentAccountMoney - prev;
						let diffOutput, currentAccountMoneyOutput;

						if (currentAccountMoney < 0) {
							currentAccountMoneyOutput = colors.red(currentAccountMoney);
						} else {
							currentAccountMoneyOutput = currentAccountMoney;
						}

						if (diff < 0) {
							diffOutput = colors.red(diff);
						} else {
							diffOutput = diff;
						}

						let row = [];
						row.push(month+'/'+(currentYear + year));
						row.push(currentAccountMoneyOutput);
						row.push(diffOutput);
						row.push(assets[currentMonth]);
						row.push(parseInt(debt[currentMonth]));
						table.push(row);

						prev = currentAccountMoney;
					}
				}
			}
		});

		console.log(table.toString());
	}

	summary(modules, duration) {
		for (module of modules) {
			let values;
			let total;
			let yearly;

//			if (module instanceof Mortgage) {
//				console.warn('Skipping mortgage');
//				continue;
//			}

			if (module instanceof Account) {
				continue;
			}

			values = modules[0].movements.filter( (item) => {return item.peer == module.name});
			total = values.reduce( (acc, value) => acc + value.amount , 0);

			if  (module.stop === undefined || module.stop === Number.MAX_VALUE) {
				yearly = total / (duration / 12);
			} else {
				yearly = total / ((module.stop - module.start) / 12)
			}

			module.expenses = total;
			console.warn(module.name + ":\n\t " + Math.ceil(total) + "\n\t " + Math.ceil(yearly))
		}

	}

}

module.exports = ConsoleReport;
