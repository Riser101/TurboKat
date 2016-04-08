'use strict'

//CRUD on config collection inside MongoDb

var procEnv = (process.env.NODE_ENV && process.env.NODE_ENV != '') ? process.env.NODE_ENV : 'development',
	getDb = require('../sgConnect'),
	debug = require('debug')('sg-conf');

/**
 * get config details based on environment from MongoDb Collection named config
 * @param
 * return
*/
exports.getConfig = function(callback) {

	//get database connection if not available
	getDb('socialgraph',function(err,db) {

		//connect to database failed
		if(err) {
			debug("MongoDb connect failed");
			return callback(0);
		}

		//query config collection based on env passed	
		db.collection('config').find({"envtype": procEnv}).toArray(function(err,response) {

			//query failed
			if(err) {
				debug("Get config from database failed");
				return callback(0);
			}

			//response is empty
			if(response.length === 0) {
				debug("Config details not found in database");
				return callback(0);
			}

			SERVER_CONFIG.RabbitMQ.queue = response[0]["details"]["RabbitMQ"]["queue"];		
			return callback(1);

		});

	});
}
