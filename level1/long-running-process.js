var http = require('http');

http.createServer( function( request, response){
    response.writeHead(200);
    response.write("Dod is running.");
    setTimeout( function(){
        response.write("Dog is done.");
        response.end();
    }, 5000);
}).listen(8080);