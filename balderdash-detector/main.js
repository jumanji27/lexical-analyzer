exports.test = function(word) {
  word = word.toLowerCase();

  var VOWELS = ['a', 'e', 'i', 'o', 'u', 'y'],
    CONSONANTS = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z'];

  var wordArray = word.split(''),

    filters = {
      doubleApostrophe: function() {
        return word.indexOf("''") >= 0 ? true : false;
      },

      apostropheInBeginning: function() {
        return word.charAt(0) === "'" ? true : false;
      },

      apostropheInMiddle: function() {
        return word.indexOf("'") >= 0 && word.length - word.indexOf("'") > 2 ? true : false;
      },

      typeWordReiteration: function() {
        var vowelsCounter = 0,
          consonantsCounter = 0;

        for (key in wordArray) {
          for (vowelKey in VOWELS) {
            if (wordArray[key] === VOWELS[vowelKey]) {
              vowelsCounter++;

              consonantsCounter = 0;
            }
          };

          for (consonantKey in CONSONANTS) {
            if (wordArray[key] === CONSONANTS[consonantKey]) {
              consonantsCounter++;

              vowelsCounter = 0;
            }
          };

          // Customizable
          var MAX_REPEATED_VOWELS = 3,
            MAX_REPEATED_CONSONANTS = 5;

          if (vowelsCounter > MAX_REPEATED_VOWELS || consonantsCounter > MAX_REPEATED_CONSONANTS) {
            return true;
          };
        };

        return false;
      },

      wordReiteration: function() {
        var previousLetter,
          counter = 0;

        for (key in wordArray) {
          if (previousLetter === wordArray[key]) {
            counter++;
          } else {
            counter = 0;
          };

          if (counter > 2) {
            return true;
          };

          previousLetter = wordArray[key];
        };

        return false;
      },

      lackOfDiversityTypes: function() {
        var vowelsCounter = 0,
          consonantsCounter = 0;

        for (key in wordArray) {
          for (vowelKey in VOWELS) {
            if (wordArray[key] === VOWELS[vowelKey]) {
              vowelsCounter++;
            };
          };

          for (consonantKey in CONSONANTS) {
            if (wordArray[key] === CONSONANTS[consonantKey]) {
              consonantsCounter++;
            };
          };
        };

        return !vowelsCounter || !consonantsCounter ? true : false;
      },

      doubleLetterBeginning: function() {
        return word.charAt(0) === word.charAt(1) ? true : false;
      },

      rejectedDoubleLetters: function() {
        var SINGLE_ONLY_LETTERS = ['a', 'h', 'i', 'j', 'k', 'q', 'u', 'v', 'w', 'x', 'y'];

        var previousLetter;

        for (key in wordArray) {
          for (singleOnlyLetterKey in SINGLE_ONLY_LETTERS) {
            if (wordArray[key] === previousLetter && wordArray[key] === SINGLE_ONLY_LETTERS[singleOnlyLetterKey]) {
              return true;
            };
          };

          previousLetter = wordArray[key];
        };

        return false;
      },

      bigrams: function() {
        BIOGRAMS = [
          'bk', 'fq', 'jc', 'jt', 'mj', 'qh', 'qx', 'vj', 'wz', 'zh', 'bq', 'fv', 'jd', 'jv', 'mq', 'qj', 'qy', 'vk',
          'xb', 'zj', 'bx', 'fx', 'jf', 'jq', 'jw', 'mx', 'qk', 'qz', 'vm', 'xg', 'zn', 'cb', 'fz', 'jg', 'jx', 'mz',
          'ql', 'sx', 'vn', 'xj', 'zq', 'cf', 'gq', 'jh', 'jy', 'pq', 'qm', 'sz', 'vp', 'xk', 'zr', 'cg', 'gv', 'jk',
          'jz', 'pv', 'qn', 'tq', 'vq', 'xv', 'zs', 'cj', 'gx', 'jl', 'kq', 'px', 'qo', 'tx', 'vt', 'xz', 'zx', 'cp',
          'hk', 'jm', 'kv', 'qb', 'qp', 'vb', 'vw', 'yq', 'cv', 'hv', 'jn', 'kx', 'qc', 'qr', 'vc', 'vx', 'yv', 'cw',
          'hx', 'jp', 'kz', 'qd', 'qs', 'vd', 'vz', 'yz', 'cx', 'hz', 'jq', 'lq', 'qe', 'qt', 'vf', 'wq', 'zb', 'dx',
          'iy', 'jr', 'lx', 'qf', 'qv', 'vg', 'wv', 'zc', 'fk', 'jb', 'js', 'mg', 'qg', 'qw', 'vh', 'wx', 'zg',
        ];

        for (key in BIOGRAMS) {
          if (word.indexOf(BIOGRAMS[key]) >= 0) {
            return true;
          };
        };

        return false;
      },

      length: function() {
        return word.length > 15 ? true : false; // Customizable
      }
    };

  for (ruleKey in filters) {
    if (word.length > 4) { // For abbreviations. Customizable
      if (filters[ruleKey]()) {
        return true;
      };
    };
  };

  return false;
};