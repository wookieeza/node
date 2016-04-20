var fs = require('fs');
var http = require('http');

http.createServer(function(request, response){
   var newFile = fs.createWriteStream("data_out.txt");
    request.pipe(newFile);

    request.on('end', function(){
        response.end('uploaded!');
    });
}).listen(8080);


//curl --upload-file names.txt http://localhost:8080