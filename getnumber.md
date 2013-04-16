#Get Number

**POST Request to http://bingo.humboldttechgroup.com:1111/?cmd=getnumber**

Returns the next drawn number in a given game. The user\_id must match that of a user who has been joined to the game of the requested game\_id.

- **game_id**: Id of the game user is joined to
- **user_id**: Id of user making request
- **timestamp**: UTC Time of request/response
- **status**: "ok" if successful, "error" if problem with request
- **message**: information about response
- **number**: the bingo number that has been drawn. B12, B6, I50, etc.

* * *

##Sample request body: 

	{  
		"timestamp": "1234567890",  
		"game_id": "1",
		"user_id": "1"  
	}
* * *

##Sample response data:

	{  
		"status": "ok",  
		"command": "getnumber",
		"message": "newest number is",
		"game_id": "1",  
		"number": "B12",
		"timestamp": "1234567890"    
	}
* * *
