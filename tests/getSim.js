var request = require('request');

var taxes = {};
taxes.vat = 0.20;
taxes.suscription = 0.05;

request.get(
	    'http://localhost:8000/simulation',
	     function(err,httpResponse,body){
		 console.warn(httpResponse.statusCode+"  "+httpResponse.statusMessage);
	     }
	     )