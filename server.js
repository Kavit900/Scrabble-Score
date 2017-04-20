//
// # Scrabble Count Server
//
// @author Kavit Mehta (zenwraight)
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
router.use(bodyParser.urlencoded({extended: true}));

var path = __dirname + '/utility/words.txt';

// Here we will create a trie object to be used to create our word list
var trie = new Trie();

var initialize_trie = function() {
   var words;
   fs.readFile(path, 'utf8', function(err, f){
      words = f.toString().split('\n');
      for(var i=0; i<words.length; i++)      
      {
         trie.add(words[i]);
      }
      if(err) {
         console.log(err);
      }
   });
};


// Helper method that calculates the permutations of all the strings
var permut = function(str) {
    if (str.length < 2) return str; // This is our break condition

    var permutations = []; // This array will hold our permutations

    for (var i=0; i<str.length; i++) {
        var char = str[i];

        // Cause we don't want any duplicates:
        if (str.indexOf(char) != i) // if char was used already
            continue;           // skip it this time

        var remainingString = str.slice(0,i) + str.slice(i+1,str.length); //Note: you can concat Strings via '+' in JS

        for (var subPermutation of permut(remainingString))
            permutations.push(char + subPermutation)
    }
    return permutations;
}

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
   var scrabble_letters = req.body.message.split(',');
   var render_template = __dirname + '/public/result.ejs';
   
   /*
   Let's validate our input:-
   1. All letters should be of size one - you cannot enter AA,B,C (wrong type of input)
   2. All letters should be in upper case
   3. Only English alphabets should be entered
   */
   var letter_size_flag = false;
   var letter_lower_case_flag = false;
   var safe_flag = true;
   var res_str = '';
   var max_score_achieved = 0;
   for(var i=0; i < scrabble_letters.length; i++) {
      res_str += scrabble_letters[i];
      if(scrabble_letters[i].length > 1) {
         letter_size_flag = true;
         safe_flag = false;
         break;
      }
      var asciss_val = scrabble_letters[i].charCodeAt(0);
      if (asciss_val < 65 || asciss_val > 90) {
         letter_lower_case_flag = true;
         safe_flag = false;
         break;
      }
   }
   
   if(safe_flag) {
      var str_permut = permut(res_str);
      for(var i=0; i<str_permut.length; i++) {
         if(trie.contains(str_permut[i])) {
            max_score_achieved = Math.max(max_score_achieved, trie.findWordScore(str_permut[i]));
         }
      }
   }
   
   if(letter_size_flag) {
      res.render(render_template, {letter_size_flag: true, error_message: 'Your each letter size should be one', success: false});
   } else if(letter_lower_case_flag) {
      res.render(render_template, {letter_size_flag: true, error_message: 'Your each letter should be in Upper Case only i.e between A-Z', success: false});
   } else {
      res.render(render_template, {result: max_score_achieved, success: true});
   }
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
   var addr = server.address();
   console.log("Server listening at", addr.address + ":" + addr.port);
   initialize_trie();
});
