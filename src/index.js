"use strict";

var colors = require('colors');

const Account = require('./account.js');
const Mortgage = require('./mortgage.js');
const CouponStrategy = require('./couponstrategy.js');
const Job = require('./job.js');
const Car = require('./car.js');
const House = require('./house.js');
const Property = require('./Property.js');

var config = require("../data.json");

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

function consoleReport(years) {
    loadedModules.forEach(function(module) {
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

          console.warn(currentMonth + ' ' + current + ' ' + diffOutput + ' --- ' + tangibleAssets[currentMonth] +' --- ' + monthlyDebt[currentMonth]);
          prev = current;
        }
      }
    }
  });
};

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
        module.data.price,
        module.expenses
      );
      loadedModules.push(car);
      break;
    }
  }
}

initModules(config);
runSimulation(360);
consoleReport(4);

// TODO:
//    * modelar liquidar de golpe (cuando el capital pendiente sea igual a una cantidad dada)
//    * euribor variable
//    * inversion de ahorro
//    * ligar ahorro con amortizaciones parciales??
//    * parametrizar ahorro mensual
//    * calcular porcentaje de intereses pagados y pendientes de pagar
//    * corregir valores de primer y último mes
//    * [frontend] varias simulaciones. Mostrar solo una tabla al mismo tiempo.
//                 Tarjetas para elegir qué datos se agregan a gráficas
//    * encapsular los ingresos en cuenta como objetos para saber de donde vienen
//    * mover ahorros teniendo en cuenta IPC a cuenta
// configurar coupon strategy para que se genere automáticamente cuando  hay más de cierta cantidad en cuenta. Lo mismo para un depósito

// constructores con mismma firma que house
