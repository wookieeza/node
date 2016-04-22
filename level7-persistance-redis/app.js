var express = require('express');

var app = express();

var server = require('http').createServer(app);

var io = require('socket.io')(server);

var redis = require('redis');

var redisClient = redis.createClient();

var messages = [];
var storeMessage = function(name, data){
    //messages.push({name: name, data: data});
    //if(messages.length > 10){
    //    messages.shift();
    //}

    var message = JSON.stringify({name:name, data:data});
    redisClient.lpush("messages",message, function(err, response){
       redisClient.ltrim("messages",0,9); // keeps newest 10 items
    });
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

       redisClient.lrange("messages",0,-1, function(err, messages){
         messages = messages.reverse();
         console.log(messages.length);
         messages.forEach(function(message){ // send the history of recent chats
               message = JSON.parse(message);//parse into JSON object
               client.emit('saying',message.name + " : " +message.data);
           });

       });


      //console.log(data+" has joined");
      client.nickname = data; // this is available both to the server and the client
      client.broadcast.emit('joins', data); // broadcast to all clients that someone has joined
       client.broadcast.emit('add chatter', data);
       redisClient.smembers('names', function(names){
           if(names) {
               names.forEach(function (name) {
                   client.emit('add chatter', name);
               });
           }
       });
       redisClient.sadd("chatters", data);

   });

    client.on('disconnect', function(name){
        var nickname = client.nickname;

            client.broadcast.emit("remove chatter", nickname);
            redisClient.srem("chatters", nickname);

    });

   client.on('saying', function(data){ // if a client emits a saying event: do this
       var nickname = client.nickname;
       //console.log(nickname +' : '+ data);
       client.broadcast.emit('saying', nickname +' : '+ data);// tell everyone else that a 'saying' event was received
       client.emit('saying', nickname +' : '+ data); //tell client, so it can show the message
       storeMessage(nickname, data);
   });
});