#Get Number

**POST Request to http://bingo.humboldttechgroup.com:1111/?cmd=getnumber**

Returns the next drawn number in a given game

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
		"status":"ok",  
		"message": "newest number is",
		"game_id":"0",  
		"number":"B12",
		"timestamp": "1234567890"    
	}
* * *
