//mode?
//allgames
//allusers




"use strict";

var http = require('http');
var url = require('url');

var sqlite3 = require('sqlite3').verbose();
var db;
var response;
var json;






function createDb(callback) {
    console.log("createDb chain");
    json = ''
    db = new sqlite3.Database('bingo.s3db', callback);
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

            console.log(json);

            i++;
        });
        closeDb();
        queryDone();
    });

    
}

function closeDb() {
    console.log("closeDb");
    db.close();
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
        console.log("queryData.arg:" + queryData.arg);

        response = res;
        var currentTime = new Date();
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        if (queryData.cmd == "allgames") {
            createDb(getAllGames);
        }
        else {
            res.write("no parameter provided");
            response.end();
        }




    }).listen('8124');

}


function queryDone() {

    console.log("queryDone");
    json = '{ "games":[\n' + json + '\n]}';
    response.write(json);
    response.end();

}

//runChainExample();

runServer();


