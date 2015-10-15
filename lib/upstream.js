var prompt = require('sync-prompt').prompt
var up = require('@deck/upstream')

function upstream (argv) {
  var deck = {}

  var deckName = argv._[argv._.length - 1]
  var fullName = require(process.cwd() + '/package.json').name
  if (argv._.length < 2) {
    var name = /^@.+\/(.+)/.exec(fullName)
    deckName = name ? name[1] : fullName
  }

  if (!/-deck$/.test(deckName)) {
    deckName += '-deck'
  }
  deck.remote = deckName
  // if (!/^@nearform\//.test(deckName)) {
  //   deckName = '@nearform/' + deckName
  // }
  deck.local = fullName

  var msg = prompt('Enter PR Message: ')

  up(deck, msg, function (err, url) {
    if (err) {
      return console.error(err)
    }
    console.log('made pull request: ', url)
  })
  return
}

module.exports = upstream
