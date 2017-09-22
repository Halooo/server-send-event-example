var http = require('http');
var fs = require('fs');

// write in buffer
const file = fs.createWriteStream('./file.txt');
setInterval(function() {
    file.write("Node.js!");
}, 1000);

http.createServer(function(req, res) {
    if (req.headers.accept && req.headers.accept == 'text/event-stream') {
        if (req.url == '/events') {
            sendSSE(req, res);
        } else {
            res.writeHead(404);
            res.end();
        }
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(fs.readFileSync(__dirname + '/index.html'));
        res.end();
    }
}).listen(8000);

function sendSSE(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    let src = fs.readFileSync('./file.txt', "utf8");
    setInterval(function() {
        src = fs.readFileSync('./file.txt', "utf8");
        constructSSE(res, src);
    }, 500);
    constructSSE(res, src);
}

function constructSSE(res, data) {
    res.write("data: " + data + '\n\n')
}