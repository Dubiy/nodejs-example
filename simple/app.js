'use strict';

const http = require('http'),
    url = require('url'),
    port = 8000,
    ip = '127.0.0.1';

let server = http.createServer((request, response) => {
    let parsedUrl = url.parse(request.url, true);

    response.writeHead(200, {'Content-Type': 'text/plain'});
    if (parsedUrl.pathname === '/bye') {
        response.end('Bye World');
    } else {
        response.end('Hello World');
    }
});

server.listen(port, ip);


console.log(`Server running at ${ip}:${port}`);

