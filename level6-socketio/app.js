var express = require('express');

//initialise an express application
var app = express();

//create an http server, have it dispatch requests to express
/**
 * http.createServer([requestListener]) so the express app is the request listener
 */
var server = require('http').createServer(app);

//require socket.io and also allow it to use the http server to listen for requests
/**
 Server(srv:http#Server, opts:Object)
 Creates a new Server and attaches it to the given srv. */
var io = require('socket.io')(server);

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});

server.listen(8080);
//now socket io and express are sharing same http server


io.on('connection', function(client){
    console.log('Client connected...');
    //emit the 'messages' event on the client i.e. send the 'messages'
    //event to the client
    client.emit('connect');

    //listen for message events received from client
    client.on('joins', function(data){
        console.log(data);
        client.nickname = data;
        client.broadcast.emit("joins",data);
    });

    //listen for message events received from client
    client.on('saying', function(data){
        var nickname = client.nickname;
        console.log(nickname+" : "+data);
        client.broadcast.emit("messages",nickname+" : "+data);
        client.emit("messages",nickname+" : "+data);
    });
});


