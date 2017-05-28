"use strict";

const Account = require('./account.js');
const Mortgage = require('./mortgage.js');
const CouponStrategy = require('./couponstrategy.js');
const Job = require('./job.js');
const Car = require('./car.js');
const House = require('./house.js');

var config = require("../data-2.json");

var loadedModules = []

function runSimulation(duration) {

    for (let month=0; month<duration; month++) {
	loadedModules.forEach(function(module) {
	    module.step();
	});
    }// for

    loadedModules.forEach(function(module) {
	if (module instanceof Account) {
	    let values = module.values();
	    let prev = parseInt(values[0]);
	    for (let i = 0; i < 12*3; i++) {
		let current = parseInt(values[i]);
		let diff = current - prev;

		console.warn(i + ' ' + current + ' ' + diff );
		prev = current;
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
		    module.data.salary
		);
		loadedModules.push(job);
		break;
		
	    case 'house':
		let house = new House(
		    module.data.name,
		    loadedModules[0],
		    module.data.price,
		    module.data.expenses
		);
		loadedModules.push(house);
		break;

	    case 'car':
		let car = new Car(
		    module.data.name,
		    loadedModules[0],
		    module.data.price,
		    module.data.taxes,
		    module.data.expenses,
		    module.data.fuel,
		    module.data.insurance
		);
		loadedModules.push(car);
		break;
	}
    }
}

initModules(config);
runSimulation(360);


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
