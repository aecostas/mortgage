var request = require('request');

request.post(
	     'http://localhost:8000/simulation', 
	     {
		 form:{
		     duration: 360
       		 }
	     },
	     function(err,httpResponse,body){
		 console.warn(httpResponse.statusCode+"  "+httpResponse.statusMessage);
	     }
	     )