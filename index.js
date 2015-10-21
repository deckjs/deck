var path = require('path')
var fs = require('fs')
var logo = require('nearform-terminal-logo').toTTY
var exec = require('exec-sync')

function arg (p) {
  return !!~arg.s.indexOf(p)
}

module.exports = function (argv) {
  var scope
  arg.s = argv._
  arg.v = argv.version || argv.v

  scope = argv.scope || '@nearform'

  if (scope[0] !== '@') { scope = '@' + scope }

  logo({leftPadding: 4, text: '  Deck'})

  if (arg('init')) {
    return require('./lib/init')()
  }

  if (arg('install') || arg('i') || arg('inst')) {
    return require('./lib/install')(argv)
  }

  if (arg('present') || arg('view')) {
    return require('./lib/present')(argv._[argv._.length - 1], argv)
  }

  // if (arg('list')) {
  //   return require('./lib/list')()
  // }

  if (arg('edit')) {
    require('./lib/edit')(argv._[argv._.length - 1], argv)
  }

  if (arg('publish') || arg('pub')) {
    return require('./lib/publish')(argv, scope)
  }

  if (arg('upstream') || arg('up')) {
    require('./lib/upstream')(argv)
  }

  if (arg.v) {
    var npmVer = exec('npm -v')
    var deckVer = exec('npm info @deck/app version')
    console.log('npm version: ' + npmVer)
    console.log('deck version: ' + deckVer)
    return
  }

  console.log('  Commands:\n')
  console.log('   ', fs.readdirSync(path.join(__dirname, 'lib')).filter(function (d) {
    return d !== 'init-input.js' && d !== 'selector.js' && d !== 'list.js'
  }).map(function (d) {
    return d.split('.')[0]
  }).join('\n    '), '\n')
}
