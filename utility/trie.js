// We will export all the Trie related classes from this file

// Individual letter scores 
function letter_score(ch) {
  var value = 0;
  switch (ch) {
    case 'A':
      value = 1;
      break;
    case 'B':
      value = 3;
      break;
    case 'C':
      value = 3;
      break;
    case 'D':
      value = 2;
      break;
    case 'E':
      value = 1;
      break;
    case 'F':
      value = 4;
      break;
    case 'G':
      value = 2;
      break;
    case 'H':
      value = 4;
      break;
    case 'I':
      value = 1;
      break;
    case 'J':
      value = 8;
      break;
    case 'K':
      value = 5;
      break;
    case 'L':
      value = 1;
      break;
    case 'M':
      value = 3;
      break;
    case 'N':
      value = 1;
      break;
    case 'O':
      value = 1;
      break;
    case 'P':
      value = 3;
      break;
    case 'Q':
      value = 10;
      break;
    case 'R':
      value = 1;
      break;
    case 'S':
      value = 1;
      break;
    case 'T':
      value = 1;
      break;
    case 'U':
      value = 1;
      break;
    case 'V':
      value = 1;
      break;
    case 'W':
      value = 4;
      break;
    case 'X':
      value = 8;
      break;
    case 'Y':
      value = 4;
      break;
    case 'Z':
      value = 10;
      break;
    default:
      break;
  }
  return value;
}

// Trie class - using my own class instead of using merkle trie provided by npm
function Node(data) {
  this.data = data;
  this.isWord = false;
  this.prefixes = 0;
  this.children = {};
  this.score = 0;
}

function Trie() {
  this.root = new Node('');
}

Trie.prototype.add = function(word) {
  if(!this.root) {
    return null;
  }
  this._addNode(this.root, word, 0);
};
Trie.prototype._addNode = function(node, word, score) {
  if(!node || !word) {
    return null;
  }
  node.prefixes++;
  var letter = word.charAt(0);
  var child = node.children[letter];
  if(!child) {
    child = new Node(letter);
    node.children[letter] = child;
    score = score + letter_score(letter);
    //console.log("Letter score is: " + letter_score(letter));
  }
  var remainder = word.substring(1);
  if(!remainder) {
    child.isWord = true;
    child.score = score;
  }
  this._addNode(child, remainder, score);
};
Trie.prototype.remove = function(word) {
  if(!this.root) {
    return;
  }
  if(this.contains(word)) {
    this._removeNode(this.root, word);
  }
};
Trie.prototype._removeNode = function(node, word) {
  if(!node || !word) {
    return;
  }
  node.prefixes--;
  var letter = word.charAt(0);

  var child = node.children[letter];
  if(child) {
    var remainder = word.substring(1);
    if(remainder) {
      if(child.prefixes === 1) {
        delete node.children[letter];
      } else {
        this._removeNode(child, remainder);
      }
    } else {
      if(child.prefixes === 0) {
        delete node.children[letter];
      } else {
        child.isWord = false;
      }
    }
  }
};
Trie.prototype.contains = function(word) {
  if(!this.root) {
    return false;
  }
  return this._contains(this.root, word);
};
Trie.prototype._contains = function(node, word) {
  if(!node || !word) {
    return false;
  }
  var letter = word.charAt(0);
  var child = node.children[letter];
  if(child) {
    var remainder = word.substring(1);
    if(!remainder && child.isWord) {
      return true;
    } else {
      return this._contains(child, remainder);
    }
  } else {
    return false;
  }
};

// no null validations required as child should be present
Trie.prototype.findWordScore = function(word) {
  if(!this.root) {
    return -10005;
  }
  console.log('I am inside');
  return this._findWordScore(this.root, word, 0);
};
Trie.prototype._findWordScore = function(node, word, score) {
  if(!node || !word) {
    return score;
  }
  
  var letter = word.charAt(0);
  var child = node.children[letter];
  var max_score = score;
  if(child) {
    console.log(child.data + " " + child.score);
    var remainder = word.substring(1);
    if(!remainder && child.isWord) {
      return Math.max(score, this._findWordScore(child, remainder, letter_score(letter) + score));
    } else {
      return this._findWordScore(child, remainder, letter_score(letter) + score);
    }
  }
  return max_score;
};
Trie.prototype.countWords = function() {
  if(!this.root) {
    return console.log('No root node found');
  }
  var queue = [this.root];
  var counter = 0;
  while(queue.length) {
    var node = queue.shift();
    if(node.isWord) {
      counter++;
    }
    for(var child in node.children) {
      if(node.children.hasOwnProperty(child)) {
        queue.push(node.children[child]);
      }
    }
  }
  return counter;
};
Trie.prototype.getWords = function() {
  var words = [];
  var word = '';
  this._getWords(this.root, words, words, word);
  return words;
};
Trie.prototype._getWords = function(node, words, word) {
  for(var child in node.children) {
    if(node.children.hasOwnProperty(child)) {
      word += child;
      if (node.children[child].isWord) {
        words.push(word);
      }
      this._getWords(node.children[child], words, word);
      word = word.substring(0, word.length - 1);
    }
  }
};
Trie.prototype.print = function() {
  if(!this.root) {
    return console.log('No root node found');
  }
  var newline = new Node('|');
  var queue = [this.root, newline];
  var string = '';
  while(queue.length) {
    var node = queue.shift();
    string += node.data.toString() + ' ';
    if(node === newline && queue.length) {
      queue.push(newline);
    }
    for(var child in node.children) {
      if(node.children.hasOwnProperty(child)) {
        queue.push(node.children[child]);
      }
    }
  }
  console.log(string.slice(0, -2).trim());
};
Trie.prototype.printByLevel = function() {
  if(!this.root) {
    return console.log('No root node found');
  }
  var newline = new Node('\n');
  var queue = [this.root, newline];
  var string = '';
  while(queue.length) {
    var node = queue.shift();
    string += node.data.toString() + (node.data !== '\n' ? ' ' : '');
    if(node === newline && queue.length) {
      queue.push(newline);
    }
    for(var child in node.children) {
      if(node.children.hasOwnProperty(child)) {
        queue.push(node.children[child]);
      }
    }
  }
  console.log(string.trim());
};

module.exports = Trie;