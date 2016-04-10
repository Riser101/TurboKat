'use strict'

var BadRequest = require('../../errors/errors').BadRequest;
var errMsg = require('../../errors/errorCodes');
var Access = require('../../lib/db/models/sgAccess');
var Unauthorized = require('../../errors/errors').Unauthorized;
var common = require('../../lib/sgCommon');
var ObjectID = require('mongodb').ObjectID;



exports.getAccess = function(req, res, next) {
	var data = {},
		res = {};
	// if(req.store.get('jwtResponse') == 'fail') {
	// 	req.store.set('message':'Invalid token, please login again.');
	// 	return;
	// }	
	Access.findAllAccess(data, function(err, result) {
		if(err) {
			return next(new Unauthorized(errMsg['1012'], 1012));
		}
		req.store.set('resData', result);
		result.forEach(function(item, idx) {
			res[item['_id']] = item['title'];
		});
		req.store.set('access', res);
		next();
	});
}

exports.isNewAccess = function(req, res, next) {
	findAccessInDb(req.body.page,function(response) {
		if(response < 0) return next(new Unauthorized(errMsg['2001'], 2001));
		if(response === 1) return next(new Unauthorized(errMsg['1017'], 1017));
		next();
	});
};

exports.addAccess = function(req, res, next) {
	var params = req.body;
	// Input params
	var data = {
		API: params.API,
		title: params.title,
		ts: {
			insISO : Math.floor(Date.now()/1000),
			insHRF : common.getHRFDate()
		}
	};

	Access.save(data, function(err, result){
		if(err){
			return next(new Unauthorized(errMsg['1006'], 1006));
		}
	});

	res.response = {'message':'Access is added successfully', "type" : "success"};
	next();
};

exports.isAccessPresent = function(req, res, next) {
	findAccessInDbExId(req.body.page,req.body.id, function(response) {
		if(response < 0) return next(new Unauthorized(errMsg['2001'], 2001));
		if(response === 1) return next(new Unauthorized(errMsg['1016'], 1016));
		next();
	});
};

exports.updateAccess = function(req, res, next) {
	var params = req.body;
	var data = {
		$set: {
			'page': params.page,
			'title': params.title,
			'ts.updISO' : Math.floor(Date.now()/1000),
			'ts.updHRF' : common.getHRFDate()
		}
	};

	Access.update({_id: new ObjectID(params.id)}, data, function(err, result) {
		if(err){
			return next(new Unauthorized(errMsg['1015'], 1015));
		}
	});

	res.response = {'message':'Access is updated successfully', "type": "success"};
	next();
};

function findAccessInDb(page,callback) {
    var data = {page: page};
    Access.findAccess(data, function(err, result) {
        if(err) return callback(-1);
        if(result != null) return callback(1);
        return callback(0);
    });
};

function findAccessInDbExId(page, id, callback) {
	var data = {page: page, _id: {$nin: [new ObjectID(id)]}};
    Access.findAccess(data, function(err, result) {
        if(err) return callback(-1);
        if(result != null) return callback(1);
        return callback(0);
    });
}