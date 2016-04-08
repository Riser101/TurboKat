'use strict'

var cluster = require('cluster'),
	workers = [],
	procEnv = (process.env.NODE_ENV && process.env.NODE_ENV != '' ) ? process.env.NODE_ENV : 'development',
	procEnv = procEnv.toLowerCase();

if(procEnv != 'production' && procEnv != 'development') {
	console.log("NODE_ENV is invalid!");
	return;
}

if (cluster.isMaster) {

	var debug = require('debug')('sg-indx'),
		cpuCount = require('os').cpus().length;

	debug('Total CPU Cores - ', cpuCount);

	// Fork workers.
	const numCPUs = require('os').cpus().length;
	for (var i = 0; i < numCPUs; i++) {
	  cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
	  console.log(`worker ${worker.process.pid} died`);
	});

} else {
	var express = require('express');
	global.app = express();
	var http = require('http'),
		path = require('path'),
		debug = require('debug')('sg-indx'),
		config = require('./config/development.json'),
		port = normalizePort(config.expressPort),
		server = http.createServer(app),
		admin = require('./routes/admin'),
		reqStore = require('reqstore'),
		bodyParser = require('body-parser');
	

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.set('port', port);
	server.listen(port);
	server.on('error', onError);
	server.on('listening', onListening);

	app.use(reqStore());
	app.use('/admin', admin);

	//global server configuration
	global.SERVER_CONFIG = config;

	

	//admin panel related routes
	app.use('/admin/*', function send(req, res) {
	  res.json(res.response);
	});

	//normalize port number
	function normalizePort(val) {
		var port = parseInt(val, 10);
		if(isNaN(port)) return val;
		if(port >= 0) return port;
		return false;
	}

	//on create http server error
	function onError(error) {
		if(error.syscall !== 'listen') {
			throw error;
		}
  		var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
		switch (error.code) {
			case 'EACCES':
				console.error(bind + ' requires elevated privileges');
      			process.exit(1);
      			break;
			case 'EADDRINUSE':
				console.error(bind + ' is already in use');
				process.exit(1);
				break;
			default:
				throw error;
		}
	}

	//on create http server listening
	function onListening() {
		var addr = server.address();
		var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	}

	module.exports = app;
 
}
