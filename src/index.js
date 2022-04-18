/* eslint-disable no-undef */
const Account = require('./modules/account.js');
const Mortgage = require('./modules/mortgage.js');
const Job = require('./modules/job.js');
const Car = require('./modules/car.js');
const House = require('./modules/house.js');
const Life = require('./modules/life.js');
const Property = require('./modules/Property.js');

const ConsoleReport = require('./reporters/consoleReport.js');
const CSVReport = require('./reporters/CSVReport.js');

const SIMULATION_TIME = 400;
var loadedModules = [];
var monthlyDebt = new Array(SIMULATION_TIME);
var tangibleAssets = new Array(SIMULATION_TIME);

tangibleAssets.fill(0);
monthlyDebt.fill(0);

function runSimulation(duration) {

  for (let month = 0; month < duration; month++) {

    for (const module of loadedModules) {
      module.step();

      if (module instanceof Property) {
        tangibleAssets[month] += module.getCurrentValue();
      }

      if (module instanceof Mortgage) {
        monthlyDebt[month] += module.getPendingCapital();
      }
    }
  }
}

function initModules(config) {
  for (let module of config) {
    switch (module.type) {
      case 'account':
        let account = new Account(module.data.name, module.data.amount);
        loadedModules.push(account);
        break;

      case 'mortgage':

        const partialAmortizations = [
          {
            type:"periodic",
            period: 6,
            amount: 10000
          }
        ]

        
        let mortgage = new Mortgage(
          module.data.mortgage,
          module.data.interest / 12,
          module.data.start,
          module.data.term,
          partialAmortizations,
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
  let monthlyData = [];

  for (let module of modules) {

    if (module instanceof Account) {
      let values = module.values();
      let prevAccountMoney = values[0];

      for (let year = 0; year < years; year++) {
        for (let month = 1; month <= 12; month++) {
          const currentMonth = year * 12 + month;
          const currentAccountMoney = values[currentMonth];

          const isMonthIncome = (item) => item.amount > 0 && item.month == currentMonth;
          const isMonthPayment = (item) => item.peer == 'Mortgage' && item.month == currentMonth;
          const sumAllAmounts = (acc, value) => acc + value.amount;
            
          const totalIncomes = module.movements
            .filter(isMonthIncome)
            .reduce(sumAllAmounts, 0);
  
          const totalMonthDebt = module.movements
            .filter(isMonthPayment)
            .reduce(sumAllAmounts, 0);

          let data = {}
          data.month = currentMonth;
          data.date = month + '/' + (currentYear + year);
          data.money = currentAccountMoney;
          data.diff = currentAccountMoney - prevAccountMoney;
          data.assets = assets[currentMonth];
          data.debt = debt[currentMonth];

          if (debt[currentMonth] === 0) {
            data.assets_money_over_debt = 0;
          } else {
            data.assets_money_over_debt = ((currentAccountMoney + assets[currentMonth]) / debt[currentMonth]) * 100;
          }

          if (totalIncomes === 0) {
            data.debt_over_incomes = 0;
          } else {
            data.debt_over_incomes = (Math.abs(totalMonthDebt) / totalIncomes) * 100;
          }

          monthlyData.push(data);
          prevAccountMoney = currentAccountMoney;
        }
      }
    }
  }

  return monthlyData;
}

var options = require("yargs")
  .usage("Usage: $0 [-c \"config file\"] [-r \"reporter\"]")
  .option("c", { alias: "config", demand: true, describe: "Configuration", type: "string" })
  .option("o", { alias: "output", demand: true, describe: "ouput csv file", type: "string" })
  .help("?")
  .alias("?", "help")
  .epilog("Copyright 2017 Andrés Estévez")
  .argv;

let consoleReport = new ConsoleReport();
let csvReport = new CSVReport();

var config = require(options.config);

initModules(config);
runSimulation(SIMULATION_TIME);

let jsonreport = mining(loadedModules, tangibleAssets, monthlyDebt, 30, 2016)

consoleReport.report(jsonreport);
csvReport.report(jsonreport, options.output);

consoleReport.summary(loadedModules, SIMULATION_TIME);
