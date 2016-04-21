var express = require('express');

var app = express();

var server = require('http').createServer(app);

var io = require('socket.io')(server);

var messages = [];
var storeMessage = function(name, data){
    messages.push({name: name, data: data});
    if(messages.length > 10){
        messages.shift();
    }
    console.log("storing "+name+" "+data);
}

app.get('/', function(request, response){
  response.sendFile(__dirname + "/index.html");
});

server.listen(8080);

io.on('connection', function(client){ // listen to socket connection from a client and do this:

   console.log("Client socket has connected");
   client.emit('connect'); // emit the connected event to the client

   client.on('joins', function(data){ // if the client emits a join, do this:

       console.log(messages.length);
       messages.forEach(function(message){ // send the history of recent chats
           //console.log(message);
           client.emit('saying',message.name + " : " +message.data);
       });

      //console.log(data+" has joined");
      client.nickname = data; // this is available both to the server and the client
      client.broadcast.emit('joins', data); // broadcast to all clients that someone has joined

   });

   client.on('saying', function(data){ // if a client emits a saying event: do this
       var nickname = client.nickname;
       //console.log(nickname +' : '+ data);
       client.broadcast.emit('saying', nickname +' : '+ data);// tell everyone else that a 'saying' event was received
       client.emit('saying', nickname +' : '+ data); //tell client, so it can show the message
       storeMessage(nickname, data);
   });
});