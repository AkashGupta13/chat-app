const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',function(socket){
  console.log('new user connected');
  socket.on('disconnect',function(socket){
    console.log('user disconnected');
  });
});



server.listen(port,function(){
  console.log('server is up on port',port);
});
