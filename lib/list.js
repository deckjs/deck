var fs = require('fs')
var decks = fs.readdirSync(process.env.HOME + '/.decks/lib/node_modules/@nearform').filter(function (name) {
  return name[0] !== '.'
})

function list () {
  var s
  s = 'Installed decks \n'.bold
  s += decks
      .map(function (name) { return name.replace(/-deck$/, '') })
      .join('\n') + '\n'
  console.log(s)
}

list.decks = decks

module.exports = list
