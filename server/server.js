const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const moment = require('moment');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',function(socket){
  console.log('new user connected');
  socket.broadcast.emit('newMessage',{
    from:'Admin',
    text :'New user joined!',
    createdAt : moment().format('h:mm a')
  });
  socket.emit('newMessage',{
    from:'Admin',
    text :'Welcome!',
    createdAt : moment().format('h:mm a')
  });
  socket.on('createMessage',function(obj){
    console.log('message Recieved' , obj);
    socket.emit('newMessage',obj);
    socket.broadcast.emit('newMessage',obj);
  });

  socket.on('disconnect',function(socket){
    console.log('user disconnected');
  });
});

server.listen(port,function(){
  console.log('server is up on port',port);
});
