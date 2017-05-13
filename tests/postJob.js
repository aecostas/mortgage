var request = require('request');

request.post(
    'http://localhost:8000/job',
    {
	form:{
	    name:'Company',
	    salary: 1900
	}
    },
    function(err,httpResponse,body){
	console.warn(httpResponse.statusCode + "  " + httpResponse.statusMessage);
    }
);
