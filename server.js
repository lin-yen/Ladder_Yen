'use strict';

var express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer( app ),
  path = require('path');

server.listen(8080);
console.log('Server running');

//使 json 可讀
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// jade css js
app.set('view engine' , 'jade');
app.set('views' , path.join(__dirname , 'Yd' , 'views'));
app.use(express.static( path.join(__dirname , 'Yd' , 'public')));

// openJade
app.get('/' , function (req , res) {
  res.render('index');
});
