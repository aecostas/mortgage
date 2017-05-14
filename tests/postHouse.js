var request = require('request');

request.post(
    'http://localhost:8000/house',
    {
	form:{
	    name: 'Piso',
	    price: 1350000,
	    general: 200,
	    insurance: 200,
	    community: 50,
	    sewerage: 20,
	    heat: 20,
	    energy: 30
	}
    },
    function(err, httpResponse, body){
	console.warn(httpResponse.statusCode + ' ' + httpResponse.statusMessage);
    }
);
