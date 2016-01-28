var request = require('request');

var taxes = {};
taxes.vat = 0.20;
taxes.suscription = 0.05;

request.post(
	     'http://localhost:8000/coupon', 
	     {
		 form:{
		     deposit: 10000,
		     fund: 0,
		     initialMonth: 0,
			 taxes: '{"vat":0.20, "suscription":0.05}',
		     dividend: 0.01,
		     interest: 0.025
		 }
	     },
	     function(err,httpResponse,body){
		 console.warn(httpResponse.statusCode+"  "+httpResponse.statusMessage);
	     }
	     )