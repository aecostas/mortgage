var request = require('request');

request({
	  url: 'http://localhost:8000/simulation',
          qs:{duration: '360'},
	  method: 'GET'
       },
       function(err,httpResponse,body){
	  console.warn(httpResponse.statusCode+"  "+httpResponse.statusMessage);
	  console.warn(body);
       });
