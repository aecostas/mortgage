const json2csv = require('json2csv');
const fs = require('fs');

class CSVReport {

	report(data, output) {
		try {
			let fields = ["month", "date", "money", "diff", "assets", "debt", "assets_money_over_debt", "debt_over_incomes"];
			let csv = json2csv({ data: data, fields: fields });

			fs.writeFile(output, csv, function(err) {
				console.log('file saved');
			});
		} catch (err) {
			// Errors are thrown for bad options, or if the data is empty and no fields are provided.
			// Be sure to provide fields if it is possible that your data array will be empty.
			console.error(err);
		}
	}
}

module.exports = CSVReport;
