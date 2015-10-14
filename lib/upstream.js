var prompt = require('sync-prompt').prompt
var up = require('@deck/upstream')

function upstream (argv) {
  var deck = {}

  if (!/-deck$/.test(argv._[argv._.length - 1])) {
    argv._[argv._.length - 1] += '-deck'
  }
  deck.remote = argv._[argv._.length - 1]
  if (!/^@nearform\//.test(argv._[argv._.length - 1])) {
    argv._[argv._.length - 1] = '@nearform/' + argv._[argv._.length - 1]
  }
  deck.local = argv._[argv._.length - 1]

  var msg = prompt('Enter PR Message: ')

  up(deck, msg, function (err, url) {
    if (err) {
      return console.error(err)
    }
    console.log(url)
  })
  return
}

module.exports = upstream
