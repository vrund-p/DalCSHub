const http = require('http'); // this is required to create an http server
const app = require('./app'); // this defines which app to run 

// defining the port on which ther server will run
const port = process.env.PORT || 8080;

// creating the server to run on app
const server = http.createServer(app);

// listening the server on the defined port 
server.listen(port, () => {
    console.log("server has been started on the port: " + port)
});
