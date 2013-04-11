#Create User

**POST Request to http://bingo.humboldttechgroup.com:1111/?cmd=createuser**

Creates a user and returns a user_id, or user_id if given login name already exists.

* * *

##Sample request body: 

	{  
		"timestamp": "1234567890",  
		"game_id": "0",
		"user_id": "1"  
	}
* * *

##Sample response data:

	{  
		"status": "ok",  
		"message": "user created successfully",
		"login": "yourusername",
		"user_id": "0",
		"timestamp": "1234567890"    
	}
If user login already exists, the following response will be returned instead:  

	{  
		"status": "ok",  
		"message": "user already exists",
		"login": "yourusername",
		"user_id": "0",
		"timestamp": "1234567890"    
	}
* * *
