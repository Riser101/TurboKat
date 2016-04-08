var express = require('express');
var router = express.Router();
var errorHandler = require('../errors/errorHandler');
var users = require('../routes/api/sgUsers');
var roles = require('../routes/api/sgRoles');
var access = require('../routes/api/sgAccess');
var common = require('../lib/sgCommon');
var config = require('../config/development');
// var jwt = require('jsonwebtoken');

router.post('/login/',
	common.isValidEmail,
	users.isExistingUser,
	users.validateLogin	
);
var secret = config.secret;

app.set('secret',secret);



//USERS
router.get('/users',
 	common.verifyJWTToken,
	access.getAccess,
	roles.getRoles, 
	users.populateUsers, 
	common.successResponse
);
router.post('/users', 
	common.isValidUsersParams, 
	users.isNewUser, 
	users.addUser
);
router.put('/users', 
	common.isValidUserPutParams,
	users.isEmailPresent,
	users.updateUser
);

//ROLES
router.get('/roles',
	access.getAccess,
	roles.getRoles, 
	common.successResponse
);
router.post('/roles', 
	common.isValidRolesParams,
	roles.isNewRole,
	roles.addRoles,
	common.successResponse
);

//ACCESS
router.get('/access',
	access.getAccess, 
	common.successResponse
);
router.post('/access', 
	common.isValidAccessParams, 
	access.isNewAccess, 
	access.addAccess
);
router.put('/access', 
	common.isValidAccessPutParams,
	access.isAccessPresent,
	access.updateAccess
);

router.use(errorHandler);

module.exports = router;
