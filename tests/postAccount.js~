var request = require('request');

request.post(
	     'http://localhost:8000/account', 
	     {
		 form:{
		     name:'Main account',
			 initial: 10000
			 }
	     },
	     function(err,httpResponse,body){
		 console.warn(httpResponse.statusCode+"  "+httpResponse.statusMessage);
	     }
	     )