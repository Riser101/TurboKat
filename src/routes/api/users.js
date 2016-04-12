'use strict'

var BadRequest = require('../../errors/errors').BadRequest;
var errMsg = require('../../errors/errorCodes');
var Users = require('../../lib/db/models/users');
var Unauthorized = require('../../errors/errors').Unauthorized;
var common = require('../../lib/commonFunctions');
var ObjectID = require('mongodb').ObjectID;
var Roles = require('../../lib/db/models/roles');
var jwt = require('jsonwebtoken');

/**
 * check if user is existing in database
 * @params 
 * @returns
*/
exports.isExistingUser = function(req, res, next) {
	findUserInDb(req.body.email,function(response) {
		if(response < 0) return next(new Unauthorized(errMsg['2001'], 2001));
		if(response === 0) return next(new Unauthorized(errMsg['2002'], 2002));
		next();
	});
};


/**
 * check if user is new user
 * @params 
 * @returns
*/
exports.isNewUser = function(req, res, next) {
	findUserInDb(req.body.email,function(response) {
		if(response < 0) return next(new Unauthorized(errMsg['2001'], 2001));
		if(response === 1) return next(new Unauthorized(errMsg['1002'], 1002));
		next();
	});
};


exports.isEmailPresent = function(req, res, next) {
	findEmailInDbExId(req.body.email,req.body.id, function(response) {
		if(response < 0) return next(new Unauthorized(errMsg['2001'], 2001));
		if(response === 1) return next(new Unauthorized(errMsg['1010'], 1010));
		next();
	});
};

/**
 * check if email address & password is valid
 * @params 
 * @returns
*/
exports.validateLogin = function(req, res, next) {
	var params = req.body;
    var data = {email: params.email,password: params.password};
    Users.findUser(data, function(err, result) {
        if(err) return next(new Unauthorized(errMsg['2001'], 2001));
		if(result === null) return next(new Unauthorized(errMsg['2003'], 2003));
		
		var token = jwt.sign(result, app.get('secret'), {
          expiresIn: 86400 
        });
		// res.response = {"message": "Login success", "type":"success"};
		res.json({
			success: true,
          	message: 'Enjoy your token!',
          	token: token	
		});
		next();
    });
};

/**
 * add new users to users collection
 * @params 
 * @returns
*/
exports.addUser = function(req, res, next) {
	var params = req.body;
	// Input params
	var dateISO = Math.floor(Date.now()/1000);
	var dateHRF = common.getHRFDate();
	
	var data = {
		email: params.email,
		password: params.password,
		role: new ObjectID(params.role),
		userStatus: params.userStatus,
		ts: {
			insISO : dateISO,
			insHRF : dateHRF,
			updISO : dateISO,
			updHRF : dateHRF
		}
	};
	
	if(!params.role) {
		var data = {
			email: params.email,
			password: params.password,
			userStatus: params.userStatus,
			ts: {
				insISO : dateISO,
				insHRF : dateHRF,
				updISO : dateISO,
				updHRF : dateHRF
			}
		};	
	}
	
	Users.save(data, function(err, result){
		if(err){
			return next(new Unauthorized(errMsg['1006'], 1006));
		}
	});

	res.response = {'message':'User is added successfully', "type" : "success"};
	next();
};

exports.updateUser = function(req, res, next) {
	var params = req.body;

	var data = {
		$set: {
			'email': params.email,
			'password': params.password,
			'role': new ObjectID(params.role),
			'userStatus': params.userStatus,
			'ts.updISO' : Math.floor(Date.now()/1000),
			'ts.updHRF' : common.getHRFDate()
		}
	};

	Users.update({_id: new ObjectID(params.id)}, data, function(err, result) {
		if(err){
			return next(new Unauthorized(errMsg['1009'], 1009));
		}
	});

	res.response = {'message':'User is updated successfully', "type": "success"};
	next();
};
/**
 * find if user is present in database
 * @params String email address & callback function
 * @returns 0 => new user, -1 => some db error, 1 => user exists
*/
function findUserInDb(email,callback) {
    var data = {email: email};
    Users.findUser(data, function(err, result) {
        if(err) return callback(-1);
        if(result != null) return callback(1);
        return callback(0);
    });
};

function findEmailInDbExId(email, id, callback) {
	var data = {email: email, _id: {$nin: [new ObjectID(id)]}};
    Users.findUser(data, function(err, result) {
        if(err) return callback(-1);
        if(result != null) return callback(1);
        return callback(0);
    });
}
/**
 * find all users in the database
 * @params 
 * @returns 
*/
exports.populateUsers = function(req, res, next) {
	var roles = req.store.get('roles');
	var params = req.body;
	var data = {};
	
	Users.findAllUser(data, function(err, usersResult) {
		if(err) {
			return new Unauthorized(errMsg['3000'], 3000);
		}
		var user = [];
		usersResult.forEach(function(item, idx) {
			item['roleTitle'] = roles[item.role];
			user.push(item);
		});
		req.store.set('resData', user);
		next();
	});
};
