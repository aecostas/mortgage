var request = require('request');

request.post(
    'http://localhost:8000/car',
    {
	form:{
	    name: 'VW Transporter',
	    price: 50000,
	    taxes: 50,
	    expenses: 200,
	    insurance: 400,
	    fuel: 60
	}
    },
    function(err, httpResponse, body){
	console.warn(httpResponse.statusCode + ' ' + httpResponse.statusMessage);
    }
);
