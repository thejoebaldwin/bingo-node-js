//mode?
//allgames
//allusers


"use strict";

var http = require('http');
var url = require('url');
var qs = require('querystring');
var md = require("node-markdown").Markdown;
var fs = require('fs')

var sqlite3 = require('sqlite3').verbose();
var db;
var response;
var request;
var json;

function createDb(callback) {
    //console.log("createDb");
    json = ''
    //if (db == undefined) {
        db = new sqlite3.Database('bingo.s3db', callback);
        console.log("opening database");
    //}
}

function getAllUsers() {
    if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            try {
                console.log('getAllUsers');
                console.log(body);
                var getAllUsers = JSON.parse(body);
                if (getAllUsers.game_id != undefined) {
                    if (!isNaN(getAllUsers.game_id)) {
                        db.all("SELECT * FROM user as u,board as b WHERE u.id = b.user_id AND b.game_id = " + getAllUsers.game_id + ";", function (err, rows) {
                            var i = 0;

                            rows.forEach(function (row) {
                                if (i > 0) {
                                    json = json + ',\n';
                                }
                                json = json + '{"game_id":"' + row.game_id + '","user_id": "' + row.user_id + '", "login": "' + row.login + '"}';
                                //console.log(json);
                                i++;
                            });
                            var now = new Date();
                            json = '{"status":"ok","message":"list of users for game in progress","timestamp":"' + now.getTime() + '", "users":[\n' + json + '\n]}';
                            //closeDb();
                            queryDone();
                        });
                    }
                    else {
                        json = "{\"status\":\"error\", \"message\": \"game_id must be numeric. Please check documentation.\"}";
                        queryDone();
                    }
                }
                else {
                    json = "{\"status\":\"error\", \"message\": \"Request body missing required fields. Please check documentation.\"}";
                    queryDone();
                }
            }
            catch (err) {
                json = "{\"status\":\"error\", \"message\": \"there was an error with your post json formatting\"}";
                console.log(err);
                queryDone();
            }

        });
    }
    else {
        helpfile("getallusers");
    }
}


function getAllGames() {
    if (request.method == 'POST') {
        console.log('readAllRows()');
        db.all("SELECT *, (SELECT count(user_id) FROM board WHERE game_id  = g.id) AS user_count FROM game AS g", function (err, rows) {
            var i = 0;
            rows.forEach(function (row) {
                if (i > 0) {
                    json = json + ',\n';
                }
                var randomnumber = Math.floor(Math.random() * row.user_limit) + 1;
             
                json = json + '{"game_id": "' + row.id + '", "win_limit": "' + row.win_limit + '", "win_count": "' + row.win_count + '", "user_limit": "' + row.user_limit + '","user_count":"' + row.user_count + '", "created_date":"' + row.created_date + '"}';

                i++;
            });
            //closeDb();
            var now = new Date();
            json = '{\"status\": \"ok\", \"message\": \"successfully retrieved list of active games\", "timestamp":"' + now.getTime() + '","games":[\n' + json + '\n]}';
            queryDone();
        });
    }
    else {
        helpfile("getallgames");
    }
}


function createUser() {

    if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            try {
                var createuser = JSON.parse(body);
                if (createuser.login != undefined) {
                    console.log('createuser:' + createuser.login);

                    var user_id = -1;
                    var counter = 0;
                    console.log("SELECT * FROM user WHERE login='" + createuser.login + "';");
                    db.all("SELECT * FROM user WHERE login='" + createuser.login + "';", function (err, rows) {
                        rows.forEach(function (row) {
                            counter++;
                            user_id = row["id"];
                        });
                        var now = new Date();
                        if (counter <= 0) {
                            db.run("INSERT INTO user (login) VALUES ('" + createuser.login + "');", function (err) {
                                json = "{\"status\":\"ok\", \"message\": \"user sucessfully created\", \"login\":\"" + createuser.login + "\",\"user_id\":\"" + this.lastID + "\", \"timestamp\":\"" + now.getTime() + "\"}";
                                queryDone();
                            });

                        }
                        else {
                            json = "{\"status\":\"ok\", \"message\": \"user already exists\", \"login\":\"" + createuser.login + "\",\"user_id\":\"" + user_id + "\", \"timestamp\":\"" + now.getTime() + "\"}";
                            queryDone();
                        }

                    });
                }
                else {
                    json = "{\"status\":\"error\", \"message\": \"Request body missing required fields. Please check documentation.\"}";
                    queryDone();
                }


            }
            catch (err) {
                json = "{\"status\":\"error\", \"message\": \"there was an error with your post json formatting\"}";
                queryDone();
            }

        });
    }
    else {
        helpfile("createuser");
    }



}


function helpfile(filename) {
    console.log("helpfile requested for " + filename);
    var data = "";
    fs.readFile(filename + '.md', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var html = md(data);
        response.writeHeader(200, { "Content-Type": "text/html" });
        response.write(html);
        response.end();
    });


}

function closeDb() {
    //console.log("closeDb");
  //  db.close();
}

function runChainExample() {
    createDb();
}


function runServer() {


    http.createServer(function (req, res) {

        //ignore the favicon request
        if (req.url === '/favicon.ico') {
            res.writeHead(200, { 'Content-Type': 'image/x-icon' });
            res.end();
            //console.log('favicon requested');
            return;
        }



        var queryData = url.parse(req.url, true).query;


        response = res;
        request = req;
        var currentTime = new Date();
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        if (queryData.cmd == "poll") {
            json = "1";
            response.write(json);
            response.end();
            return;
        }
        else if (queryData.cmd == "allgames") {
            createDb(getAllGames);
        }
        else if (queryData.cmd == "allusers") {
            createDb(getAllUsers);
        }
        else if (queryData.cmd == "createuser") {

            createDb(createUser);
        }
        else if (queryData.cmd == "joingame") {

           createDb(joinGame());
        }
        else if (queryData.cmd == "getnumber") {
             createDb(getNumber());
        }
        else if (queryData.cmd == "getboard") {
             createDb(getBoard());
        }
        else {

            if (request.method == 'POST') {

                json = "{\"status\":\"error\", \"message\": \"no parameter provided\"}";
                console.log(json);
                response.write(json);
                response.end();
            }
            else {
                helpfile("main");
            }
        }
        var date = new Date();
        var current_hour = date.getHours();
        console.log(date);



    }).listen('1111');

}

function contains(val, theArray) {
    for (var i = 0; i < theArray.length; i++) {
        if (theArray[i] === val) {
            return true;
        }
    }
    return false;
}

function generateColumn(offset) {
    var bingoColumn = new Array();

   
    var board = "";

    var randomnumber;
    
    for (var i = 0; i < 5; i++) {

        //need to check for uniqueness
        var unique = false;
        var counter = 0;
       
         randomnumber = Math.floor(Math.random() * 15) + offset;
         while (contains(randomnumber, bingoColumn)) {
           randomnumber = Math.floor(Math.random() * 15) + offset;
         }
         bingoColumn.push(randomnumber);
    }

    var output = "";
    for (var i = 0; i < 5; i++) {

     
        if (output != "")
        {
          output = output + ",";
        }
        output = output + bingoColumn[i]; 
    }
    return output;
} 

function joinGame() {

    if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            try {
                var counter = 0;
                var joinGame = JSON.parse(body);
                //check if game exists
                if (joinGame.game_id != undefined && joinGame.user_id != undefined) {
                   if(!isNaN(joinGame.game_id) && !isNaN(joinGame.user_id)) {
                    db.all("SELECT * FROM game WHERE id=" + joinGame.game_id + ";", function (err, rows) {
                        rows.forEach(function (row) {
                            counter++;
                        });
                        //game exists
                        if (counter > 0) {
                            //reset counter
                            counter = 0;
                            
                            var board = "";
                            var board_id = "";
                            //check if user has already been added to game
                            db.all("SELECT * FROM board WHERE user_id=" + joinGame.user_id + " AND game_id=" + joinGame.game_id + ";", function (err, rows) {
                                rows.forEach(function (row) {
                                    counter++;
                                    board = row["contents"];
                                    board_id = row["id"];
                                });
                                //user has not been joined to game
                                if (counter == 0) {
                                    //generate board
                                    board = "";
                                    board = board + generateColumn(1) + ",";
                                    board = board + generateColumn(16) + ",";
                                    board = board + generateColumn(31) + ",";
                                    board = board + generateColumn(46) + ",";
                                    board = board + generateColumn(61);


                                    db.run("INSERT INTO board (user_id,game_id,contents) VALUES (" + joinGame.user_id + "," + joinGame.game_id + ",'" + board + "');", function (err) {
                                        var now = new Date();
                                        json = "{\"status\":\"ok\", \"message\": \"game sucessfully joined\",\"board_id\":\"" + this.lastID + "\",\"board\": \"" + board + "\", \"game_id\":\"" + joinGame.game_id + "\",\"user_id\":\"" + joinGame.user_id + "\", \"timestamp\":\"" + now.getTime() + "\"}";
                                        queryDone();
                                    });
                                }
                                else {
                                    var now = new Date();
                                    json = "{\"status\":\"ok\", \"message\": \"user already joined game\",\"board_id\":\"" + board_id + "\",\"board\": \"" + board + "\", \"game_id\":\"" + joinGame.game_id + "\",\"user_id\":\"" + joinGame.user_id + "\", \"timestamp\":\"" + now.getTime() + "\"}";
                                    queryDone();
                                }
                            });
                        }
                        else {
                            //game not found
                            json = "{\"status\":\"error\", \"message\": \"no game exists with game_id " + joinGame.game_id + " \"}";
                            queryDone();
                        }
                    });
                    }
                    else
                    {
                      json = "{\"status\":\"error\", \"message\": \"game_id and user_id must be numeric values. Please check documentation.\"}";
                      queryDone();
                    }
                }
                else {
                    json = "{\"status\":\"error\", \"message\": \"Request body missing required fields. Please check documentation.\"}";
                    queryDone();
                }

            }
            catch (err) {
                json = "{\"status\":\"error\", \"message\": \"there was an error with your post json formatting\", \"error\":\"" + err + "\"}";
                console.log(json);
                response.write(json);
                response.end();
            }


        });
    }
    else {
        helpfile("joingame");
    }



   
  
}

function getNumber() {

    if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            try {
                var getNumber = JSON.parse(body);
                var counter = 0;
                if (getNumber.game_id != undefined && getNumber.user_id != undefined) {
                    if (!isNaN(getNumber.game_id) && !isNaN(getNumber.user_id)) {
                        db.all("SELECT * FROM board WHERE game_id=" + getNumber.game_id + " AND user_id = " + getNumber.user_id + ";", function (err, rows) {
                            rows.forEach(function (row) {
                                counter++;
                            });
                            if (counter > 0) {
                                var randomnumber = Math.floor(Math.random() * 75) + 1;

                                var bingoLetter = "";
                                if (randomnumber <= 15) {
                                    bingoLetter = "B";
                                }
                                else if (randomnumber <= 30) {
                                    bingoLetter = "I";
                                }
                                else if (randomnumber <= 45) {
                                    bingoLetter = "N";
                                }
                                else if (randomnumber <= 60) {
                                    bingoLetter = "G";
                                }

                                else {
                                    bingoLetter = "O";
                                }

                                //need to work in logic of already existing numbers.
                                //  store in db? can't do query EVERY time.
                                //arrays of arrays to store for each game?
                                var now = new Date();
                                json = "{\"status\":\"ok\", \"message\": \"number requested\", \"number\":\"" + bingoLetter + randomnumber + "\", \"timestamp\":\"" + now.getTime() + "\"}";

                                queryDone();
                            }
                            else {
                                json = "{\"status\":\"error\", \"message\": \"user has not joined that game\"}";
                                queryDone();
                            }


                        });
                    }
                     
                        else
                        {
                              json = "{\"status\":\"error\", \"message\": \"game_id and user_id must be numeric values. Please check documentation.\"}";
                                queryDone();
                        }
                }
                else {
                    json = "{\"status\":\"error\", \"message\": \"Request body missing required fields. Please check documentation.\"}";
                    queryDone();
                }


            }
            catch (err) {
                json = "{\"status\":\"error\", \"message\": \"there was an error with your post json formatting\"}";
                queryDone();
            }


        });


     
    }
    else {
        helpfile("getnumber");
    }

}

function queryDone() {

    console.log("queryDone:" + json);
    response.write(json);
    response.end();

}

//runChainExample();

runServer();


