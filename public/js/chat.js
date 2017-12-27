var socket = io();

socket.on('connect',function(){
  var params = $.deparam(window.location.search);
  socket.emit('join',params , function(err){
    if (err){
      alert(err);
      window.location.href = '/';
    }else{
      console.log('No error');
    }
  });
});

socket.on('updateUserList',function(users){
   var ol = $('<ol></ol>');
   users.forEach(function(user){
     ol.append($('<li></li>').text(user));
   });
   console.log(users);
   $('#users').html(ol);
});

socket.on('disconnect',function(){
  console.log('disconnected from server');
});



function scrollToBottom(){
  var messages = $("#messages");
  var newMessage = messages.children('li:last-child');
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
      messages.scrollTop(scrollHeight);
  }
}

socket.on('newMessage',function(message){
  var template = $("#message-template").html();
  var html = Mustache.render(template,{
    text:message.text,
    from : message.from,
    createdAt : message.createdAt
  });

  $("#messages").append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  socket.emit('createMessage',{
    text : $('[name=message]').val(),
    createdAt : moment().format('h:mm a')
},function(){
  $('[name=message]').val('');
});
$('[name=message]').val('');
});
