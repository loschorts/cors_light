// The purpose of this server is to wrap API requests from the client to the
// API in order to avoid cross-origin problems.

const express = require('express');
const request = require('request');
const bodyParser = require('body-parser')

const app = express();
const port = 3000;

const logger = (req, res, next) => {
	console.log(`${req.method} ${req.path}`)
	next();
}

app.use(express.static('public'));
app.use(logger);
app.use(bodyParser.json());

// Routes

const root = process.argv[2]
console.log(`API Root: ${root}`);

// API GET Request Route
app.get('/*', (req, res) => {

	const path = root + req.path.slice(5);
	console.log("requesting GET " + path);
	
	const options = {
	  url: path,
	  method: "GET",
	  json: true,
	};

	function callback(error, response, body) {
		if (response) {
			res.statusCode = response.statusCode;
			console.log(`API responded with ${response.statusCode}`)
		} else {
			res.statusCode = 404;
			console.log("Could not connect to API");
		}
	  res.setHeader('Content-Type', 'application/json');
	  res.send(body);
	}
	
	request(options, callback);
})

// API PATCH Request Route
app.patch("/*", (req,res) =>{
	const path = root + req.path.slice(5);
	console.log("Requesting PATCH " + path);
	
	const options = {
	  url: path,
	  method: "PATCH",
	  json: true,
	  body: req.body
	};

	function callback(error, response, body) {
		if (response) {
			res.statusCode = response.statusCode;
			console.log(`API responded with ${response.statusCode}`)
		} else {
			res.statusCode = 404;
			console.log("Could not connect to API");
		}
		
	  res.setHeader('Content-Type', 'application/json');
	  res.send(body);
	}
	
	request(options, callback);
})

// Start listening

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on port ${port}`)
});
