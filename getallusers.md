#Get All Users

**POST Request to http://bingo.humboldttechgroup.com:1111/?cmd=allusers**

Returns all currently joined users in a given game

* * *

##Sample request body: 

	{  
 		"timestamp": "1234567890",  
 		"game_id": "0"  
	}
* * *

##Sample response data:

	{  
		"status":"ok",  
 		"message": "list of users for game in progress",
		"game_id":"0",  
		"timestamp": "1234567890",    
 		"users": [
			{
			"user_id":"1",
			"login":"username1"
			},
			{
			"user_id":"2",
			"login":"username2"
			}
		 ]
	}
* * *
