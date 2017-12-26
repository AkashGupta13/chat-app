const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;

var app = express();

app.use(express.static('public'));

app.get('/',function (request,response,next){
  response.send('Server is up and running!');
});

app.listen(3000,function(){
  console.log('server is up on port',port);
});
