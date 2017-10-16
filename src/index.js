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

var loadedModules = [];
var monthlyDebt = new Array(360);
var tangibleAssets = new Array(360);

tangibleAssets.fill(0);
monthlyDebt.fill(0);

function runSimulation(duration) {

  for (let month=0; month<duration; month++) {
    loadedModules.forEach(function(module) {
      module.step();

      if (module instanceof Property) {
        tangibleAssets[month] += module.getCurrentPrice();
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
        module.expenses
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

var options = require( "yargs" )
    .usage( "Usage: $0 [-c \"config file\"] [-r \"reporter\"]")
//    .option( "r", { alias: "report", demand: true, describe: "Report backend", type: "string" } )
    .option( "c", { alias: "config", demand: true, describe: "Configuration", type: "string" } )
    .help( "?" )
    .alias( "?", "help" )
//    .example( "$0 https://example.com/api/posts", "Get a list of posts" )
//    .example( "$0 https://example.com/api/posts --post --data \"{ 'title': 'Avast ye!', 'body': 'Thar be a post hyar!'}\"", "Create a new post" )
    .epilog( "Copyright 2017 Andrés Estévez" )
    .argv;

let report = new ConsoleReport();
var config = require(options.config);

initModules(config);
runSimulation(360);

report.report(loadedModules, tangibleAssets, monthlyDebt, 30, 2016);
