#Join Game

**POST Request to http://bingo.humboldttechgroup.com:1111/?cmd=joingame**

Use this command to join a login to an existing game. A successful response will return the Game ID and a comma delimited list of numbers, in order, that make up the user's bingo card. The numbers should be placed in the card from top to bottom in a 5 x 5 grid. For example: using the below "board" data should produce a card with the following numbers in the "B" column, from top to bottom: 12, 1, 15, 2, and 9.

- **game_id**: Id of the game attempting to join. 
- **user_id**: Id of user to join to game
- **timestamp**: UTC Time of request/response
- **board_id**: Returned id of generated board (bingo card)
- **board**: Comma-delimited list of numbers making up the generated board
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
		"command": "joingame",
 		"message": "game sucessfully joined",  
		"board_id": "1",
 		"board": "12,1,15,2,9,24,30,22,18,21,34,43,45,31,42,54,50,58,56,55,68,63,70,72,62",  
 		"game_id": "1",
		"user_id": "1",
		"timestamp": "1234567890"
	}
If user has already joined game, the following will be returned instead, with the board data being the previously generated value.
	
	{  
		"status": "ok",  
		"command": "joingame",
 		"message": "user already joined game",  
		"board_id": "1",
 		"board": "12,1,15,2,9,24,30,22,18,21,34,43,45,31,42,54,50,58,56,55,68,63,70,72,62",  
 		"game_id": "1",
		"user_id": "1",
		"timestamp": "1234567890"
	}
* * *