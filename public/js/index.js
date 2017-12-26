var socket = io();
socket.on('connect',function(){
  console.log('connected to server');
});

socket.on('disconnect',function(){
  console.log('disconnected from server');
});

socket.on('newMessage',function(m){
  console.log('New message Recieved' , m);
  var li = $('<li></li>');
  li.text(m.from + ": " + m.text);
  $("#messages").append(li);
});

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  socket.emit('createMessage',{
    from : 'User',
    text : $('[name=message]').val()
},function(){

});
});
