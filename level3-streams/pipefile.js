var fs = require('fs');

var file = fs.createReadStream('names.txt');
var newFile = fs.createWriteStream('names_copy.txt')

file.pipe(newFile);