#Get All Users

**POST Request to http://bingo.humboldttechgroup.com:1111/?cmd=allusers**

Returns all currently joined users in a given game

- **game_id**: Id of the game requested to retrieve list of users 
- **timestamp**: UTC Time of request/response
- **status**: "ok" if successful, "error" if problem with request
- **users**: Array of user elements, each containing it's own user\_id and login attributes.
- **user\_id**: Id of user listed
- **login**: Username of user listed

* * *

##Sample request body: 

	{  
 		"timestamp": "1234567890",  
 		"game_id": "1"  
	}
* * *

##Sample response data:

	{  
		"status": "ok",  
		"command": "allusers",
 		"message": "list of users for game in progress",
		"game_id": "1",  
		"timestamp": "1234567890",    
 		"users": [
			{
			"user_id": "1",
			"login": "bingowizard"
			},
			{
			"user_id": "2",
			"login": "bingobarian"
			}
		 ]
	}
* * *
