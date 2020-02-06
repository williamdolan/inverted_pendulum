var connect = require('connect');
var serveStatic = require('serve-static');
var http = require('http');
var cors = require("cors");

var port = process.argv[2] || 8080;

var app = connect();
app.use(serveStatic(__dirname));
//app.options('*', cors());
//app.use(function(req, res, next){
//  res.setHeader('Access-Control-Allow-Origin', '*');
//  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//});

http.createServer(app).listen(port);
//connect().use(serveStatic(__dirname)).listen(port, function(req, res){
//    res.setHeader('Access-Control-Allow-Origin', '*');
//    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//    console.log('Server running on ' + port);
//});
