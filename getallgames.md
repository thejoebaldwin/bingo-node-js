#Get All Games  

**POST Request to http://bingo.humboldttechgroup.com:1111/?cmd=allgames**

Returns all currently in progress games

- **games**: Array of game elements, each containing it's own game\_id, win\_limit, win\_count, user\_limit, user\_count, and created\_date.
- **game_id**: id of the game. used in joingame command to join user to the game.
- **win_limit**: number of wins allowed before game is closed
- **win_count**: number of wins so far in current game
- **user_limit**: limit of how many users are allowed to participate in current game
- **user_count**: number of users currently joined to the game
- **created_date**: timestamp of when game was created
- **status**: "ok" if successful, "error" if problem with request
- **message**: information about response

* * *

##Sample request body: 

    Post Body not needed
* * *

##Sample response data:

	{
		"status": "ok",
		"message": "successfully retrieved list of active games",  
	 	"games":[  
					{
					"game_id": "1",  
 					"win_limit": "10",  
 					"win_count": "0",  
 					"user_limit": "10",  
					"user_count":"9",  
 					"created_date":"2013-04-04 00:00:00"  
				},  
				{  
					"game_id": "2",  
 					"win_limit": "5",  
 					"win_count": "2",  
 					"user_limit": "5",  
					"user_count":"4",  
 					"created_date":"2013-04-03 00:00:00"
				}
			]  
	}
* * *