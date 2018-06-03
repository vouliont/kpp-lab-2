const express = require('express');
let app       = express();
const server  = require('http').Server(app);
const io      = require('socket.io')(server);
const path    = require('path');

app.use(express.static('../files'));

app.get('/', function(req, res) {
   res.send();
});

app.get('*', function(req, res) {
   res.statusCode = 404;
   res.sendFile(path.resolve(__dirname, '../files/error.html'));
});

io.on('connection', function(socket) {
   socket.on('send message to server', function(obj) {
      io.emit('get message on client', obj);
   });

   socket.on('disconnect', function() {
      
   });
});

server.listen(8080);