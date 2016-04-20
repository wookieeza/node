var http = require('http');

http.createServer(function(request, response){
   response.writeHead(200);

   request.pipe(response);
    //request.on('readable', function(){
    //   var chunk = null;
    //    while(null != (chunk = request.read())){
    //        response.write(chunk);
    //        console.log(chunk.toString());
    //    }
    //});
    //
    //request.on('end', function(){
    //    console.log('end')
    //   response.end();
    //});

}).listen(8080);

// curl -d 'howdy pardner' http://localhost:8080