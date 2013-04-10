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
    db = new sqlite3.Database('bingo.s3db', callback);
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
               
                db.all("SELECT * FROM user", function (err, rows) {
                    var i = 0;
                 
                    rows.forEach(function (row) {
                        if (i > 0) {
                            json = json + ',\n';
                        }
                        json = json + '{"id": "' + row.id + '", "login": "' + row.login + '"}';
                        //console.log(json);
                        i++;
                    });
                  
                    json = '{ "users":[\n' + json + '\n]}';
                    closeDb();
                    queryDone();
                });
            }
            catch (err) {
                json = "{\"status\":\"error\", \"message\": \"there was an error with your post json formatting\"}";
                console.log(err);
            }
            queryDone();
        });


      
    }
    else {
        helpfile("getallusers");
    }
}


function getAllGames() {
    if (request.method == 'POST') {
        console.log('readAllRows()');
        db.all("SELECT * FROM Game", function (err, rows) {
            var i = 0;
            rows.forEach(function (row) {
                if (i > 0) {
                    json = json + ',\n';
                }
                var randomnumber = Math.floor(Math.random() * row.user_limit) + 1;
                json = json + '{"game_id": "' + row.id + '", "win_limit": "' + row.win_limit + '", "win_count": "' + row.win_count + '", "user_limit": "' + row.user_limit + '","user_count":"' + randomnumber + '", "created_date":"' + row.created_date + '"}';

                i++;
            });
            closeDb();
            json = '{ "games":[\n' + json + '\n]}';
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
            console.log('createuser:' + createuser.login);
            db.run("INSERT INTO user (login) VALUES ('" + createuser.login + "');", closeDb());
            json = "{\"status\":\"ok\", \"message\": \"user created successfully\" \"login\":\"" + createuser.login + "\"}";
           
           }
        catch (err) {
            json = "{\"status\":\"error\", \"message\": \"there was an error with your post json formatting\"}";
        }
        queryDone();
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
    console.log("closeDb");
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

        var date = new Date();
        var current_hour = date.getHours();
        console.log(date);

        var queryData = url.parse(req.url, true).query;


        response = res;
        request = req;
        var currentTime = new Date();
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        if (queryData.cmd == "allgames") {
            createDb(getAllGames);
        }
        else if (queryData.cmd == "allusers") {
            createDb(getAllUsers);
        }
        else if (queryData.cmd == "createuser") {

            createDb(createUser);
        }
        else if (queryData.cmd == "joingame") {

            joinGame();
        }
        else if (queryData.cmd == "getnumber") {
            getNumber();
        }
        else if (queryData.cmd == "getboard") {
            getBoard();
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
            var joinGame = JSON.parse(body);

            //VERIFY GAME EXISTS!!!


            var board = "";

            board = board + generateColumn(1) + ",";
            board = board + generateColumn(16) + ",";
            board = board + generateColumn(31) + ",";
            board = board + generateColumn(46) + ",";
            board = board + generateColumn(61);


            json = "{\"status\":\"ok\", \"message\": \"new board generated\", \"board\": \"" + board + "\", \"game_id\":\"" + joinGame.game_id + "\"}";
         
        }
        catch (err) {
            json = "{\"status\":\"error\", \"message\": \"there was an error with your post json formatting\"}";
        }
            console.log(json);
            response.write(json);
            response.end();

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

                json = "{\"status\":\"ok\", \"message\": \"number requested\", \"number\":\"" + bingoLetter + randomnumber + "\"}";
               
            }
            catch (err) {
                json = "{\"status\":\"error\", \"message\": \"there was an error with your post json formatting\"}";
            }
            console.log(json);
            response.write(json);
            response.end();

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


