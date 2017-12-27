const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const moment = require('moment');
const validation = require('./utils/validation');
const {Users} = require('./utils/users');
var {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',function(socket){
  console.log('new user connected');

  socket.on('join',function(params,callback){
    if(!validation.isRealString(params.name) || !validation.isRealString(params.room)){
      return callback('Name and Room Name are Required!');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);
    io.to(params.room).emit('updateUserList',users.getUsersList(params.room));
    socket.broadcast.to(params.room).emit('newMessage',{
      from:'Admin',
      text :params.name + ' has joined!',
      createdAt : moment().format('h:mm a')
    });
    socket.emit('newMessage',{
      from:'Admin',
      text :'Welcome to the Chat Room!',
      createdAt : moment().format('h:mm a')
    });
    callback();
  });

  socket.on('createMessage',function(obj){
    var user = users.getUser(socket.id);
    if(user && validation.isRealString(obj.text)){
      io.to(user.room).emit('newMessage',generateMessage(user.name,obj.text));
    }
  });

  socket.on('disconnect',function(){
    var user = users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUserList',users.getUsersList(user.room));
      io.to(user.room).emit('newMessage',
      {from:'Admin',text:user.name + ' has left!',createdAt:moment().format('h:mm a')
    });
    }
  });
});

server.listen(port,function(){
  console.log('server is up on port',port);
});
