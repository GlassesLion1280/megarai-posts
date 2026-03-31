const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const HOST = '0.0.0.0'; // Allow access from other machines on the network

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');

    let filePath;
    if (req.url === '/' || req.url === '/index.html') {
        filePath = path.join(__dirname, 'index.html');
    } else if (req.url === '/api/posts') {
        filePath = path.join(__dirname, 'posts.json');
    } else {
        filePath = path.join(__dirname, req.url);
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`🦁 めがらいポスト管理サーバー起動！`);
    console.log(`   ローカル: http://localhost:${PORT}`);
    console.log(`   ネットワーク: http://192.168.3.28:${PORT}`);
    console.log(`   Ctrl+C で停止`);
});
