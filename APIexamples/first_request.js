const axios = require ('axios');
require('locus');

axios.get('https://jsonplaceholder.typicode.com/todos/1')
	.then(function(response){
	if(response.status==200){
		console.log("fecthed website");
		console.log(response.data);
		console.log("the title is "+ response.data["title"]);
	}
  })
  .catch(function (error) {
    // handle error
    console.log("something went wrong");
  })

