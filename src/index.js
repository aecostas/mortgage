"use strict";

const Account = require('./account.js');
const Mortgage = require('./mortgage.js');
const CouponStrategy = require('./couponstrategy.js');
const Job = require('./job.js');
const Car = require('./car.js');
const House = require('./house.js');
const Life = require('./life.js');
const Property = require('./Property.js');

const ConsoleReport = require('./consoleReport.js');
const CSVReport = require('./CSVReport.js');

const SIMULATION_TIME = 400;
var loadedModules = [];
var monthlyDebt = new Array(SIMULATION_TIME);
var tangibleAssets = new Array(SIMULATION_TIME);

tangibleAssets.fill(0);
monthlyDebt.fill(0);

function runSimulation(duration) {

  for (let month=0; month<duration; month++) {
    loadedModules.forEach(function(module) {
      module.step();

      if (module instanceof Property) {
		  tangibleAssets[month] += module.getCurrentValue();
      }

      if (module instanceof Mortgage) {
        monthlyDebt[month] += module.getPendingCapital();
      }
    });
  }// for
}

function initModules(config) {
  for (module of config) {
    switch (module.type) {
      case 'account':
      let account = new Account(module.data.name, module.data.amount);
      loadedModules.push(account);
      break;

      case 'mortgage':
      let mortgage = new Mortgage(
        module.data.mortgage,
        module.data.interest / 12,
		module.data.start,
        module.data.term,
        {},
        loadedModules[0]
      );
      loadedModules.push(mortgage);
      break;

      case 'job':
      let job = new Job(
        module.data.name,
        loadedModules[0],
        module.data.salary,
        module.data.start
      );
      loadedModules.push(job);
      break;

      case 'house':
      let house = new House(
        module.data.name,
        loadedModules[0],
        module.data.start,
        module.data.stop,
        module.data.incoming,
        module.data.price,
        module.expenses
      );
      loadedModules.push(house);
      break;

      case 'car':
      let car = new Car(
        module.data.name,
        loadedModules[0],
        module.data.start,
        module.data.stop,
        module.data.incoming,
        module.data.price,
        module.expenses,
		module.data.decay
      );
      loadedModules.push(car);
      break;

      case 'life':
      let life = new Life(
          loadedModules[0],
          module.expenses
      );
      loadedModules.push(life);

      break;
    }
  }
}

function mining(modules, assets, debt, years, currentYear) {
	let _this = this;
	let monthlyData = [];

	modules.forEach(function(module) {
		if (module instanceof Account) {
			let values = module.values();
			let movements = module.movements;
			let prev = parseInt(values[0]);

			for (let year=0; year < years; year++) {
				for (let month = 1; month <= 12; month+=1) {
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

					let data = {}
					data.month = currentMonth;
					data.date = month+'/'+(currentYear + year);
					data.money = currentAccountMoney;
					data.diff = diff;
					data.assets = assets[currentMonth];
					data.debt = debt[currentMonth];
					data.assets_money_over_debt = ((currentAccountMoney + assets[currentMonth]) / debt[currentMonth])*100;
					data.debt_over_incomes = (Math.abs(totalMonthDebt) / totalIncomes) * 100;

					monthlyData.push(data);
					prev = currentAccountMoney;
				}
			}
		}
	});

	return monthlyData;
}

var options = require( "yargs" )
    .usage( "Usage: $0 [-c \"config file\"] [-r \"reporter\"]")
    .option( "c", { alias: "config", demand: true, describe: "Configuration", type: "string" } )
	.option( "o", { alias: "output", demand: true, describe: "ouput csv file", type: "string" } )
    .help( "?" )
    .alias( "?", "help" )
    .epilog( "Copyright 2017 Andrés Estévez" )
    .argv;

let report = new ConsoleReport();
let csvReport = new CSVReport();
var config = require(options.config);

initModules(config);
runSimulation(SIMULATION_TIME);

let jsonreport = mining(loadedModules, tangibleAssets, monthlyDebt, 30, 2016)

report.report(jsonreport);
csvReport.report(jsonreport, options.output);
report.summary(loadedModules, SIMULATION_TIME);
