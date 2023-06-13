const http = require('http');
const fs = require('fs');
const path = require('path');

const ryux = http.createServer((req, res) => {   
    let filePath = '.' + req.url;
    if (filePath === './') {
      filePath = './index.html';
    }
  
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
    };

    const contentTypeHeader = contentType[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404);
          res.end('404 Not Found');
        } else {
          // Terjadi kesalahan server lainnya
          res.writeHead(500);
          res.end('500 Internal Server Error');
        }
      } else {
        // Mengirim file yang diminta
        res.writeHead(200, { 'Content-Type': contentTypeHeader });
        res.end(content, 'utf-8');
      }
    });
  });
  
ryux.listen(3000, (err) => {
    if(!err){
      console.log('RyuX is online stabilised');
    }
    else{
      console.log(err);
    }
});