#Create User

**POST Request to http://bingo.humboldttechgroup.com:1111/?cmd=createuser**

Creates a user and returns a user\_id, or existing user\_id if given login name already exists.

* * *

##Sample request body: 

	{  
		"timestamp": "1234567890",  
		"login": "bingowizard"  
	}
* * *

##Sample response data:

	{  
		"status": "ok",  
		"message": "user created successfully",
		"login": "bingowizard",
		"user_id": "1",
		"timestamp": "1234567890"    
	}
If user login already exists, the following response will be returned instead:  

	{  
		"status": "ok",  
		"message": "user already exists",
		"login": "bingowizard",
		"user_id": "1",
		"timestamp": "1234567890"    
	}
* * *
