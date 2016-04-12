'use strict'

var BadRequest = require('../../errors/errors').BadRequest;
var errMsg = require('../../errors/errorCodes');
var Roles = require('../../lib/db/models/roles');
var Unauthorized = require('../../errors/errors').Unauthorized;
var common = require('../../lib/sgCommon');
var Access = require('../../lib/db/models/sgAccess');


exports.getRoles = function(req, res, next) {
	var data = {},
		res = {},
		access = req.store.get('access');
	
	// if(req.store.get('jwtResponse') == 'fail') {
	// 	return;
	// }	
			
	Roles.findAllRoles(data, function(err, result) {
		if(err) {
			return next(new Unauthorized(errMsg['1008'], 1008));
		}
		var responseData = [];
		result.forEach(function(item, idx) {
			var accessObj = [];
			res[item['_id']] = item['role'];
			item['access'].forEach(function(acItem, acIdx) {
				if(acItem == 'skip_access') {
					accessObj.push({
						'accessId' : acItem,
						'title' : '*'
					});
					return;
				}
				accessObj.push({
					'accessId' : acItem,
					'title' : access[acItem]
					
 				});
			});
			item['access'] = accessObj;
			responseData.push(item);
		});
		req.store.set('roles', res);
		req.store.set('resData', responseData);
		next();
	});
}

exports.addRoles = function(req, res, next) {
	var params = req.body;
	// Input params
	var dateISO = Math.floor(Date.now()/1000);
	var dateHRF = common.getHRFDate();

	var data = {
		role: params.role,
		desc: params.desc,
		access: params.access,
		ts: {
			insISO : dateISO,
			insHRF : dateHRF,
			updISO : dateISO,
			updHRF : dateHRF
		}
	};

	Roles.save(data, function(err, result){
		if(err){
			return next(new Unauthorized(errMsg['3002'], 3002));
		}
	});

	req.store.set('message', 'successfully added new role');
	next();
};

exports.updateRoles = function(req, res, next) {
	var params = req.body;
	var data = {
		$set: {
			'role': params.role,
			'desc': params.desc,
			'access': params.access,
			'ts.updISO' : Math.floor(Date.now()/1000),
			'ts.updHRF' : common.getHRFDate()
		}
	};

	Roles.update({_id: new ObjectID(params.id)}, data, function(err, result) {
		if(err){
			return next(new Unauthorized(errMsg['3005'], 3005));
		}
	});

	req.store.set('message','Role is updated successfully');
	next();
};

exports.isNewRole = function(req, res, next) {
	findRoleInDb(req.body.role,function(response) {
		if(response < 0) return next(new Unauthorized(errMsg['3003'], 3003));
		if(response === 1) return next(new Unauthorized(errMsg['3004'], 3004));
		next();
	});
};

exports.isRolePresent = function(req, res, next) {
	findRoleInDbExId(req.body.role,req.body.id, function(response) {
		if(response < 0) return next(new Unauthorized(errMsg['1006'], 1006));
		if(response === 1) return next(new Unauthorized(errMsg['3004'], 3004));
		next();
	});
};

function findRoleInDb(role,callback) {
    var data = {role: role};
    Roles.findRole(data, function(err, result) {
        if(err) return callback(-1);
        if(result != null) return callback(1);
        return callback(0);
    });
};

function findRoleInDbExId(role, id, callback) {
	var data = {role: role, _id: {$nin: [new ObjectID(id)]}};
    Roles.findRole(data, function(err, result) {
        if(err) return callback(-1);
        if(result != null) return callback(1);
        return callback(0);
    });
}

