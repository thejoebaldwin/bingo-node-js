#Quit Game

**POST Request to http://bingo.humboldttechgroup.com:1111/?cmd=quitgame**

Use this command to quit a login to a previously joined game. 

- **game_id**: Id of the game attempting to quit. 
- **user_id**: Id of user to quit game
- **timestamp**: UTC Time of request/response
- **status**: "ok" if successful, "error" if problem with request
- **message**: information about response


* * *

##Sample request body: 

	{  
 		"timestamp": "1234567890",  
 		"game_id": "1",  
 		"user_id":"1"  
	}
* * *

##Sample response data:

	{  
		"status": "ok",  
		"command": "quitgame",
 		"message": "game sucessfully quit",  
 		"game_id": "1",
		"user_id": "1",
		"timestamp": "1234567890"
	}
If user has already quit game or not currently joined, the following will be returned instead.
	
	{  
		"status": "ok",  
		"command": "quitgame",
 		"message": "user is not joined to game",  
 		"game_id": "1",
		"user_id": "1",
		"timestamp": "1234567890"
	}
* * *