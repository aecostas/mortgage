var request = require('request');

request.post(
	     'http://localhost:8000/mortgage', 
	     {
		 form:{
		     mortgage:'100000',
			 interest: 1.2,
			 term:360
			 }
	     },
	     function(err,httpResponse,body){
		 console.warn(httpResponse.statusCode+"  "+httpResponse.statusMessage);
	     }
	     )