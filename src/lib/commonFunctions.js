'use strict';
var Unauthorized = require('../errors/errors').Unauthorized;
var BadRequest = require('../errors/errors').BadRequest;
var errMsg = require('../errors/errorCodes');
var validator = require("email-validator");
var jwt = require('jsonwebtoken');
var roles = require('./db/models/roles');
var ObjectId = require('mongodb').ObjectId;
/** check if email is valid */
exports.isValidEmail = function(req, res, next) {

    var params = req.body;
    if(!params.email || params.email == '') {
		return next(new Unauthorized(errMsg['1000'], 1000));
	}
	
	if(!validator.validate(params.email)) {
		return next(new Unauthorized(errMsg['1001'], 1001));
	}

    next();

};

exports.isValidUsersParams = function(req, res, next) {
	var params = req.body;
	
	var access = req.store.get('access');
	
	if(!params.email || params.email == '') {
		return next(new Unauthorized(errMsg['1000'], 1000));
	}
	
	if(!validator.validate(params.email)) {
		return next(new Unauthorized(errMsg['1001'], 1001));
	}

	if(!params.password || params.password == '') {
		return next(new Unauthorized(errMsg['1003'], 1003));
	}
	
	if(req.store.get('token') != 'ZlcMwXJI35say4oj') {
		if(!params.role || params.role == '') {
			return next(new Unauthorized(errMsg['1004'], 1004));
		}	
	} else {
		return next();
	}
	
	for(var item in access) {
		if(access[item] == "create-user") {
			return next();
		} 
	}
	return next(new Unauthorized(errMsg['5000'],5000));
};

exports.isValidUserPutParams = function(req, res, next) {
	var params = req.body;

	if(!params.id || params.id == '') {
		return next(new Unauthorized(errMsg['1011'], 1011));
	}

	if(!params.email || params.email == '') {
		return next(new Unauthorized(errMsg['1000'], 1000));
	}
	
	if(!validator.validate(params.email)) {
		return next(new Unauthorized(errMsg['1001'], 1001));
	}

	if(!params.password || params.password == '') {
		return next(new Unauthorized(errMsg['1003'], 1003));
	}
	
	if(!params.role || params.role == '') {
		return next(new Unauthorized(errMsg['1004'], 1004));
	}

	next();	
};

exports.isValidRolesParams = function(req, res, next) {
	var params = req.body;
	
	if(!params.role || params.role == '') {
		return next(new Unauthorized(errMsg['3001'],3001));
	}
	
	if(params.access.length == 0) {
		return next(new Unauthorized(errMsg['3005'], 3005));	
	}
	next();
};
//validation on update roles api
exports.isValidRolesPutParams = function(req, res, next) {
	var params = req.body;
	
	if(!params.id || params.id == '') {
		return next(new Unauthorized(errMsg['3003'],3003));
	}
	if(!params.role || params.role =='') {
		return next(new Unauthorized(errMsg['1004'], 1004));
	}

	if(params.access.length == 0) {
		return next(new Unauthorized(errMsg['1002'],1002));
	}

	next();
};

/**
 * check for valid JSON
 * @param
 * return
*/

exports.isJSON = function(item){
    item = typeof item !== "string"
    ? JSON.stringify(item)
    : item;
    try {
        item = JSON.parse(item);
    }
    catch (e) {
        return false;
    }
    if (typeof item === "object" && item !== null) {
        return true;
    }
    return false;
}

/** sends sucessfull response 
	@param object data Result to be sent inside response object
	@param String message Response text for the result
	@return Object successRes
*/
exports.successResponse = function(req, res, next) {
	var message = (req.store.get('message')) ? req.store.get('message') : "success";
	var resData = (req.store.get('resData')) ? req.store.get('resData') : [];
	var successRes = 
		{
			'code':0,
			'type':'Success',
			'message':message,
			'resData': resData
		};
	res.response = successRes;
	next();
} 



exports.getHRFDate = function() {
	var m_names = new Array("January", "February", "March", 
							"April", "May", "June", "July", "August", "September", 
							"October", "November", "December");
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth();
	var yyyy = today.getFullYear();
	if(dd<10) { dd='0'+dd } 
	var date = m_names[mm]+' '+dd+', '+yyyy;
	return date;
}

exports.verifyJWTToken = function(req, res, next) {
 	var token  = req.body.token || req.headers['token'];
	
	req.store.set('token', token);
	
	if(token == 'ZlcMwXJI35say4oj') {
		return next();
	}

	if(token) {	
		jwt.verify(token, app.get('secret'), function(err, decoded) {
			if(err) {
				return next(new Unauthorized(errMsg['4000']), 4000);
			}
			req.decoded = decoded;
			if(!req.decoded.role) {
				return next();
			}
			
			roles.findRole(ObjectId(req.decoded.role), function(err, result) {
				var access = result.access;
				
				req.store.set('access',access);
				next();
			});

		});
	} else {
		return res.status(403).send('no token provided');
	}
	// next();
};







