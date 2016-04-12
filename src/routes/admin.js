var express = require('express');
var router = express.Router();
var errorHandler = require('../errors/errorHandler');
var users = require('../routes/api/users');
var roles = require('../routes/api/roles');
var common = require('../lib/commonFunctions');
var config = require('../config/development');


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
	// roles.getRoles, 
	users.populateUsers, 
	common.successResponse
);
router.post('/users', 
	common.verifyJWTToken,
	common.isValidUsersParams, 
	users.isNewUser, 
	users.addUser
);
router.put('/users',
	common.verifyJWTToken, 
	common.isValidUserPutParams,
	users.isEmailPresent,
	users.updateUser
);

//ROLES
router.get('/roles',
	common.verifyJWTToken,
	roles.getRoles, 
	common.successResponse
);
router.post('/roles', 
	common.verifyJWTToken,
	common.isValidRolesParams,
	roles.isNewRole,
	roles.addRoles,
	common.successResponse
);
router.put('/roles',
	common.verifyJWTToken,
	common.isValidRolesPutParams,
	roles.isRolePresent,
	roles.updateRoles,
	common.successResponse
);

router.use(errorHandler);

module.exports = router;
