//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var express = require('express');
const bodyParser= require('body-parser')
var router = express();
var server = http.createServer(router);
var fs = require('fs');
var util = require('util');
const Trie = require(__dirname + '/utility/trie.js');

router.use(express.static('public'));
router.use(bodyParser.urlencoded({extended: true}))

var words = [];

var path = __dirname + '/utility/words.txt';

fs.readFile(path, 'utf8', function(err, f){
    words = f.toString().split('\n');
    if(err) {
       console.log(err);
    }
});

router.get('/', function(req, res, next){
   fs.readFile(__dirname + '/public/index.html', function(err, data) {
      res.writeHead(200, {
         'Content-Type': 'text/html',
            'Content-Length': data.length
      });
      res.write(data);
      res.end();
      
      if(err) {
         console.og(err);
      }
   });
});

router.post('/', function(req, res) {
   console.log(req.body);
   var trie = new Trie();
   res.render(__dirname + '/public/result.ejs', {result: req.body.message});
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
   var addr = server.address();
   console.log("Server listening at", addr.address + ":" + addr.port);
});
