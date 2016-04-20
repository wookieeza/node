var hello = require('./custom_hello.js');
var gb = require('./custom_goodbye.js');
var myMod = require('./my_module.js');
require('./custom_goodbye.js').goodbye();
var makeRequest = require('./app_post_request.js');

hello();
gb.goodbye();

myMod.foo();
myMod.bar();
makeRequest("Here's looking at you kid!");
makeRequest("Here's looking at you kid :)!");