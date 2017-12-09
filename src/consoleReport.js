'use strict';

var colors = require('colors');
var Table = require('cli-table');

const Account = require('./account.js');
const Mortgage = require('./mortgage.js');

class ConsoleReport {

	_redOutput(amount) {
		let output = amount;

		if (amount < 0) {
			output = colors.red(amount);
		}
		return output;
	}

	report(modules, assets, debt, years, currentYear) {
		let _this = this;
		let header = [];
		header.push('Month');
		header.push('Date');
		header.push('Account');
		header.push('Diff');
		header.push('Assets');
		header.push('Debt');
		header.push('assets&account\nover debt (%)');
		header.push('debt over\nincomes (%)');
		var table = new Table({
			head: header
		});

		modules.forEach(function(module) {
			if (module instanceof Account) {
				let values = module.values();
				let movements = module.movements;
				let prev = parseInt(values[0]);
				for (let year=0; year < years; year++) {
					for (let month = 1; month <= 12; month=month+2) {
						let currentMonth = year*12 + month;
						let currentAccountMoney = parseInt(values[currentMonth]);
						let diff = currentAccountMoney - prev;

						// calculate incomes for this month
						// TODO: review this implementation
						let incomes = module.movements.filter( (item) => {
							return item.amount > 0 && item.month == currentMonth;
						});
						let totalIncomes = incomes.reduce( (acc, value) => acc + value.amount, 0);

						// TODO: replace 'Mortgage' with a type/class
						let monthDebt = module.movements.filter( (item) => {
							return item.peer == 'Mortgage' && item.month == currentMonth;
						});
						let totalMonthDebt = monthDebt.reduce( (acc, value) => acc + value.amount, 0);

						let row = [];
						row.push(currentMonth);
						row.push(month+'/'+(currentYear + year));
						row.push( _this._redOutput(currentAccountMoney));
						row.push( _this._redOutput(diff));
						row.push( parseInt(assets[currentMonth]));
						row.push( parseInt(debt[currentMonth]));
						row.push( parseInt(((currentAccountMoney + assets[currentMonth]) / debt[currentMonth])*100) );
						row.push( parseInt(( Math.abs(totalMonthDebt) / totalIncomes) * 100));
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
