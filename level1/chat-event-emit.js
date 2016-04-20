var events = require('events');
var EventEmitter = events.EventEmitter;

var chat = new EventEmitter();
var users = [], chatlog = [];

chat.on('message', function(message){
    console.log(' said: '+message);
    chatlog.push(message);
});

chat.on('join', function(nickname) {
    console.log(nickname+' joined')
   users.push(nickname);
});

chat.emit('join', 'debbie');
chat.emit('message', 'howdy');