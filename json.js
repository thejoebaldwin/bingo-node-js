//mode?
//allgames
//allusers


"use strict";

var http = require('http');
var url = require('url');
var qs = require('querystring');

var sqlite3 = require('sqlite3').verbose();
var db;
var response;
var request;
var json;

function createDb(callback) {
    console.log("createDb");
    json = ''
    db = new sqlite3.Database('bingo.s3db', callback);
}

function getAllUsers() {

    console.log('getAllUsers');
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


function getAllGames() {

    console.log('readAllRows()');
    db.all("SELECT * FROM Game", function (err, rows) {
        var i = 0;
        rows.forEach(function (row) {
            if (i > 0) {
                json = json + ',\n';
            }
            json = json + '{"id": "' + row.id + '", "win_limit": "' + row.win_limit + '", "win_count": "' + row.win_count + '", "user_limit": "' + row.user_limit + '", "created_date":"' + row.created_date + '"}';
          
            i++;
        });
        closeDb();
        json = '{ "games":[\n' + json + '\n]}';
        queryDone();
    });
}


function createUser() {

    if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var createuser = JSON.parse(body);
            console.log('createuser:' + createuser.login);
            db.run("INSERT INTO user (login) VALUES ('" + createuser.login + "');", closeDb());
        });
    }



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
            console.log('favicon requested');
            return;
        }


        var queryData = url.parse(req.url, true).query;


        response = res;
        var currentTime = new Date();
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        if (queryData.cmd == "allgames") {
            createDb(getAllGames);
        }
        else if (queryData.cmd == "allusers") {
            createDb(getAllUsers);
        }
        else if (queryData.cmd == "createuser") {
            request = req;
            createDb(createUser);
        }
        else {
            res.write("no parameter provided");
            response.end();
        }




    }).listen('8124');

}


function queryDone() {

    console.log("queryDone");
    
    console.log("queryDone:" + json);
    response.write(json);
    response.end();

}

//runChainExample();

runServer();


