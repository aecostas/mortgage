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

	report(data, currentYear) {
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

		for (let row of data) {
			let tablerow = [];

			tablerow.push(row.month);
			tablerow.push(row.date);
			tablerow.push( _this._redOutput(row.money));
			tablerow.push( _this._redOutput(row.diff));
			tablerow.push( parseInt(row.assets));
			tablerow.push( parseInt(row.debt));
			tablerow.push( parseInt(row.assets_money_over_debt));
			tablerow.push( parseInt(row.debt_over_incomes));

			table.push(tablerow);
		}
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
