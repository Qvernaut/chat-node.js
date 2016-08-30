var http = require('http');

http.createServer(function(req, res) {
    console.log('123')
}).listen(8080);

console.log('Server running on port 8080');