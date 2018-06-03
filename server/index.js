const http = require('http');
const fs   = require('fs');
const chat = require('./chat');

http.createServer(function (req, res) {
   switch (req.url) {
      case '/':
         sendFile('../files/index.html', res);
         break;
      case '/subscribe':
         chat.subscribe(req, res);
         break;
      case '/publish':
         let body = '';

         req
            .on('readable', function() {
               let slice = req.read();
               if (slice !== null) {
                  body += slice;
               }
            })
            .on('end', function() {
               try {
                  body = JSON.parse(body);

                  if (body.length > 1e4) {
                     res.statusCode = 413;
                     res.end('Message is too big!');
                  }
               } catch (e) {
                  res.statusCode = 400;
                  res.end('Bad Request');
                  return;
               }

               chat.publish(body);
               res.end();
            })
         break;
      default:
         res.statusCode = 404;
         res.end('Not found!');
   }
}).listen(8080);


function sendFile(fileName, res) {
   let fileStream = fs.createReadStream(fileName);

   fileStream
      .on('error', function() {
         res.statusCode = 500;
         res.end('Server Error');
      })
      .pipe(res);

   res.on('close', function() {
      fileStream.destroy();
   });
}