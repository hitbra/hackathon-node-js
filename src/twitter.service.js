const Twitter = require('twitter');
const fs = require('fs');

let client = null;

module.exports = {
  newClient,
  listarTweetsHitBRA
}

function newClient(options) {
  if (process.env.NODE_ENV === 'production') {
    if (client == null) {
      client = new Twitter(options);
    }
  }
}

function listarTweetsHitBRA(userId) {
  if (process.env.NODE_ENV === 'production') {
    return client.get('statuses/user_timeline', {
      user_id: '1014911910188331008',
      count: 100
    })
      .then(
        tweets => tweets.map(tweet => {
          return {
            texto: tweet.text,
            hashtags: tweet.entities.hashtags.map(hashtag => hashtag.text)
          }
        })
      );
  } else {
    try {
      return Promise.resolve(require('./../tweets.json'));
    } catch (e) {
      const erro = '*** Atenção, seu JSON pode estar inválido ou você apagou ou renomeou o arquivo "tweets.json" da sua pasta raíz!! ***';
      return Promise.reject(erro);
    }
  }
}