var trie;

module.exports = {
  init: function(data) {
    trie = JSON.parse(data.toString());
  },

  test: function(word) {
    word = word.toLowerCase();

    var wordArray = word.split(''),
      root = trie;

    for (key in wordArray) {
      var letter = wordArray[key];

      if (!root[letter]) {
        return false;
      };

      root = root[letter];
    };

    return root.$ ? true : false;
  }
};