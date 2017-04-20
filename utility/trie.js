// We will export all the Trie related classes from this file

// Individual letter scores 
var letter_score = {
    A: 1,
    B: 3,
    C: 3,
    D: 2,
    E: 1,
    F: 4,
    G: 2,
    H: 4,
    I: 1,
    J: 8,
    K: 5,
    L: 1,
    M: 3,
    N: 1,
    O: 1,
    P: 3,
    Q: 10,
    R: 1,
    S: 1,
    T: 1,
    U: 1,
    V: 4,
    W: 4,
    X: 8,
    Y: 4,
    Z: 10
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
    node.score = score + letter_score[child];
  }
  var remainder = word.substring(1);
  if(!remainder) {
    child.isWord = true;
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
    var remainder = word.substring(1);
    if(!remainder && child.isWord) {
      return score;
    } else {
      return this._contains(child, word, child.score + score);
    }
  }
  return score;
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