#Bingo API v1 4/8/13#

Supported Operations

- [Get All Games](http://bingo.humboldttechgroup.com:1111/?cmd=allgames "Get All Games")
- [Get All Users](http://bingo.humboldttechgroup.com:1111/?cmd=allusers "Get All Users")
- [Create User](http://bingo.humboldttechgroup.com:1111/?cmd=createuser "Create User")
- [Join Game](http://bingo.humboldttechgroup.com:1111/?cmd=joingame "Join Game")
- [Get Number](http://bingo.humboldttechgroup.com:1111/?cmd=getnumber "Get Number")
- [Quit Game](http://bingo.humboldttechgroup.com:1111/?cmd=quitgame "Quit Game")

Usage  


- All json field names in the response will be lowercase only. All field names in request need to be lowercase as well.
- All responses will return a "command" parameter. This will allow you to standardize your json parsing depending on which request you are making.
- Get a list of all currently in progress games. Within each block of "game" data, there is a game\_id.
- Create a user. This will give you a user\_id that you can then join a game with. You can use "bingowizard" for login and/or "1" for user_id (see below) if you'd like to skip this step.
- Join a game using the user\_id and game\_id. This will return a "board" that you will use to construct your bingo card.
- Once you have your board, call use the get number operation to play the game!
- Be sure to check the response messages when getting errors to help troubleshoot your requests, and don't forget to validate your json.
- When initially working with any these services, use the "bingowizard" login or user\_id of "1" if you do not want to create a user. This user has been joined to the game with game\_id of "1".
- A monitoring service has been setup to send notifications in the event of outages, within 5 minutes. Error reports (specifically, what you were doing when it crashed) should be sent to [joe@humboldttechgroup.com](mailto:joe@humboldttechgroup.com "email")