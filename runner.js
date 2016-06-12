(function() {
  var analyzer = require('./balderdash-detector/main'),
    http = require('http'),
    name;

  // Customizable
  var REQS_COUNT = 10,
    ID_MULTIPLIER = 100000;

  var init = function() {
    if (analyzer.init) {
      var fs = require('fs');

      analyzer.init(
        fs.readFileSync('./trie/data.json')
      );

      name = 'trie';
    } else {
      name = 'balderdash-detector'
    };

    var reqCounter = 0;

    while (reqCounter < REQS_COUNT) {
      var rawID =
        Math.round(
          Math.random() * ID_MULTIPLIER
        ),
      ID = rawID + 1;

      http
        .get(
          {
            host: 'hola.org',
            path: '/challenges/word_classifier/testcase/' + ID
          },
          function(request) {
            var res = '',
              arrayURL = request.req.path.split('/');

            request
              .on('data', function(chunk) {
                res += chunk.toString();
              })
              .on('end', function() {
                reqDone({
                  success: {
                    ID: arrayURL[arrayURL.length - 1],
                    words: JSON.parse(res)
                  }
                });
              });
          }
        ).on('error', function(event) {
          reqDone({
            error: {
              message: event.message
            }
          });
        });

      reqCounter++;
    };
  };

  var reqDoneCounter = 0,
    input = [];

  var OUTPUT_SEPARATOR = '\n================================\n';

  var reqDone = function(res) {
    if (res.success) {
      input.push(res.success.words);

      if (!reqDoneCounter) {
        console.log(OUTPUT_SEPARATOR);
      }

      reqDoneCounter++;

      var IDString = res.success.ID.toString(),
        IDMultiplierString = (ID_MULTIPLIER - 1).toString();

      if (IDString.length < IDMultiplierString.length) {
        while (IDMultiplierString.length - IDString.length) {
          IDString += ' ';
        };
      };

      console.log('Request with id ' + IDString + ' successfully done');
    } else {
      console.log('Request done with error: ' + res.error.message);
    };

    if (reqDoneCounter === REQS_COUNT) {
      cast(input);
    };
  };

  var cast = function(input) {
    var samples = [],
      results = [],
      inputKeys = [];

    for (inputKey in input) {
      for (inputBunchKey in input[inputKey]) {
        samples.push(
          input[inputKey][inputBunchKey]
        );

        if (name === 'balderdash-detector') {
          var result = !analyzer.test(inputBunchKey);
        } else {
          var result = analyzer.test(inputBunchKey);
        };

        results.push(result);

        inputKeys.push(inputBunchKey);
      };
    }

    var accuracy = 0,
      correctRejectedWords = '',
      mistakesWords = '';

    var WORD_SEPARATOR = ', ';

    for (sampleKey in samples) {
      if (samples[sampleKey] === results[sampleKey]) {
        accuracy++;
      } else if (samples[sampleKey] && !results[sampleKey]) {
        correctRejectedWords += inputKeys[sampleKey] + WORD_SEPARATOR;
      } else if (!samples[sampleKey] && results[sampleKey]) {
        mistakesWords += inputKeys[sampleKey] + WORD_SEPARATOR;
      };
    };

    var WORD_ENDING_COUNT = 2;

    correctRejectedWords = correctRejectedWords.substring(0, correctRejectedWords.length - WORD_ENDING_COUNT);
    mistakesWords = mistakesWords.substring(0, mistakesWords.length - WORD_ENDING_COUNT);

    if (correctRejectedWords.length) {
      var correctRejectedWordsOutput = '\nCorrect Rejected Words: ' + correctRejectedWords + '\n\n';
    } else {
      var correctRejectedWordsOutput = '\nAll good with real words!\n\n';
    }

    if (mistakesWords.length) {
      var mistakesWordsOutput = 'Mistakes Words: ' + mistakesWords + '\n\n';
    } else {
      var mistakesWordsOutput = 'OMG! All good with pseudowords!\n\n';
    }

    console.log(
      correctRejectedWordsOutput + mistakesWordsOutput + 'Result: ' +
      Math.round(accuracy / samples.length * 10000) / 100 + '% on ' + REQS_COUNT * 100 + ' words\n' + OUTPUT_SEPARATOR
    );
  };

  init();
})();