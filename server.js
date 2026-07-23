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
        // パストラバーサル対策: クエリ除去→デコード→正規化して __dirname 配下に限定
        let reqPath;
        try {
            reqPath = decodeURIComponent(req.url.split('?')[0]);
        } catch (e) {
            res.writeHead(400);
            res.end('Bad Request');
            return;
        }
        const resolved = path.resolve(__dirname, '.' + path.normalize('/' + reqPath));
        if (resolved !== __dirname && !resolved.startsWith(__dirname + path.sep)) {
            res.writeHead(403);
            res.end('Forbidden');
            return;
        }
        filePath = resolved;
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
