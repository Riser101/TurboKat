
**NodeJS v4.1.0** and **MongoDB  v3.0.7**
## Installation
Run `npm install` in the project root to install TurboKat dependencies.
## Execution 
Run `node index.js` in project root to execute the server.
## Steps:
1. Create user with token `ZlcMwXJI35say4oj`.
2. Login with created user's detail.
3. Create an admin role with the **token** returned in response after login [see create role example below].
4. Upate the user, and assign the new created admin role. [see update roles example below].

## APIs
### Create users
This route creates news users.

Sample Request:

	{
		"email":"sampleEmail@gmail.com",
		"password":"samplePassword",
		"token":"ZlcMwXJI35say4oj"		
	}						    
The above token is a unique key, must for creating the very first user.

Sample Response:
	
	{
 		 "message": "User is added successfully",
 		 "type": "success"
	}

### Login
This route signs-in the user and returns a JWT token. This JWT token is compulsory for further  requests if the user doesn't wish to login every time aka Session Management.

Sample Request:

	{
   		 "email":"admin@gmail.com",
   		 "password":"abc@123"
	}
Sample Response:

	{
	    "success": true,
	    "message": "Enjoy your token!",
	    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzBjYTYyYWIzYmZmOTUwNTY4YmE2ZTciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiYWJjQDEyMyIsInRzIjp7Imluc0lTTyI6MTQ2MDQ0Njc2MiwiaW5zSFJGIjoiQXByaWwgMTIsIDIwMTYiLCJ1cGRJU08iOjE0NjA0NDY3NjIsInVwZEhSRiI6IkFwcmlsIDEyLCAyMDE2In0sImlhdCI6MTQ2MDQ1MzMzNywiZXhwIjoxNDYwNTM5NzM3fQ.xaZZ0Ca4xFzhC1uiUrcgepxkGaoR-ZJqBhYHROW1xbs"
	}	

### Get users
This route gets list of all the users created.

Sample Request:

Set http request header as:

	token : eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzBjYTYyYWIzYmZmOTUwNTY4YmE2ZTciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiYWJjQDEyMyIsInRzIjp7Imluc0lTTyI6MTQ2MDQ0Njc2MiwiaW5zSFJGIjoiQXByaWwgMTIsIDIwMTYiLCJ1cGRJU08iOjE0NjA0NDY3NjIsInVwZEhSRiI6IkFwcmlsIDEyLCAyMDE2In0sImlhdCI6MTQ2MDQ1MzMzNywiZXhwIjoxNDYwNTM5NzM3fQ.xaZZ0Ca4xFzhC1uiUrcgepxkGaoR-ZJqBhYHROW1xbs
Sample Response:

	{
        "code": 0,
        "type": "Success",
        "message": "success",
        "resData": [
            {
                "_id": "570ca62ab3bff950568ba6e7",
                "email": "admin@gmail.com",
                "password": "abc@123",
                "ts": {
                    "insISO": 1460446762,
                    "insHRF": "April 12, 2016",
                    "updISO": 1460446762,
                    "updHRF": "April 12, 2016"
                }
            }
        ]
    }

### Create Roles
This route creates new roles.

Sample Request:							    

	{
        "role": "admin",
        "desc": "Has access to all users",
        "access": [
            "create-user"
        ],
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzBjYTYyYWIzYmZmOTUwNTY4YmE2ZTciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiYWJjQDEyMyIsInRzIjp7Imluc0lTTyI6MTQ2MDQ0Njc2MiwiaW5zSFJGIjoiQXByaWwgMTIsIDIwMTYiLCJ1cGRJU08iOjE0NjA0NDY3NjIsInVwZEhSRiI6IkFwcmlsIDEyLCAyMDE2In0sImlhdCI6MTQ2MDQ1MzMzNywiZXhwIjoxNDYwNTM5NzM3fQ.xaZZ0Ca4xFzhC1uiUrcgepxkGaoR-ZJqBhYHROW1xbs"
    }
Sample Response:
	
	{
 	 	"code": 0,
	    "type": "Success",
	    "message": "successfully added new role",
	    "resData": []
	}    

### Edit Users
This routes edits already created users.

Sample Request:							    
	
	{
    	"id":"570ca62ab3bff950568ba6e7",
	    "email":"admin@gmail.com",
   	    "password":"abc@123",
	    "role":"570cc228a5a27c9956ec10cd"
	}
Sample Response:		
	
	{
  		"message": "User is updated successfully",
  		"type": "success"
	}
### Get Roles
This route gets the list of already created rsers.

Sample Request:							    

Set http request header as:

	token : eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzBjYTYyYWIzYmZmOTUwNTY4YmE2ZTciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiYWJjQDEyMyIsInRzIjp7Imluc0lTTyI6MTQ2MDQ0Njc2MiwiaW5zSFJGIjoiQXByaWwgMTIsIDIwMTYiLCJ1cGRJU08iOjE0NjA0NDY3NjIsInVwZEhSRiI6IkFwcmlsIDEyLCAyMDE2In0sImlhdCI6MTQ2MDQ1MzMzNywiZXhwIjoxNDYwNTM5NzM3fQ.xaZZ0Ca4xFzhC1uiUrcgepxkGaoR-ZJqBhYHROW1xbs
Sample Response:		
    
    {
        "code": 0,
        "type": "Success",
        "message": "success",
        "resData": [
            {
                "_id": "570cc228a5a27c9956ec10cd",
                "role": "admin",
                "desc": "Has access to all users",
                "access": [
                    "create-user"
                ],
                "ts": {
                    "insISO": 1460453928,
                    "insHRF": "April 12, 2016",
                    "updISO": 1460453928,
                    "updHRF": "April 12, 2016"
                }
            }
        ]
    }						    
### Update Roles
This route updates already created roles.

Sample Request:
	
	{
	    "id": "570cc228a5a27c9956ec10cd",
	    "role": "updated admin",
	    "access": [
	        "570cc228a5a27c9956ec10cd"
	    ],
	    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzBjYTYyYWIzYmZmOTUwNTY4YmE2ZTciLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiYWJjQDEyMyIsInRzIjp7Imluc0lTTyI6MTQ2MDQ0Njc2MiwiaW5zSFJGIjoiQXByaWwgMTIsIDIwMTYiLCJ1cGRJU08iOjE0NjA0NDY3NjIsInVwZEhSRiI6IkFwcmlsIDEyLCAyMDE2In0sImlhdCI6MTQ2MDQ1MzMzNywiZXhwIjoxNDYwNTM5NzM3fQ.xaZZ0Ca4xFzhC1uiUrcgepxkGaoR-ZJqBhYHROW1xbs"
	}
Sample Response:

	{
  		"code": 0,
     	"type": "Success",
	    "message": "Role is updated successfully",
 		 "resData": []
	}	
## Error Codes

| Error Code                            | Description                                 |
|---------------------------------------|---------------------------------------------|
| 1000                                  | Email address is required|
| 1001									 | Invalid Email Address
| 1002                                  |  User is already registered  |
| 1003									 | Password is required                          |
| 1004                                  | Role is required           |
| 1006					                 |Error while inserting user               |
| 1007                                  | Error while finding user   |
| 1008 								     | Error while getting data from roles                       |
| 1009 									 | Error while updating user            |
| 1010									 | Same Email address is already present               |
| 1011 									 | User Id is required      |
| 							             |                                               |
| 2001									  | Oops something went wrong. Retry after sometime |
| 2002                                  |You're not registered with us please sign up.|
|2003									|Invalid username or password|
|||
|3000									|Failed to fetch data from database|
|3001									|Role is required                   |
|3002|									Error while inserting user|
|3003									|Oops something went wrong. Retry after sometime.|
|3004									|Role name is already present              |
|3005									|Access list cannot be empty|
|||
|4000									|Invalid token please login|
|||
|5000									|you're not allowed to create new users. you're not an admin.|	|	






