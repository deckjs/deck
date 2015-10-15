var path = require('path')
var fs = require('fs')
var logo = require('nearform-terminal-logo').toTTY

function arg (p) {
  return !!~arg.s.indexOf(p)
}

module.exports = function (argv) {
  var scope
  arg.s = argv._

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

  console.log('  Commands:\n')
  console.log('   ', fs.readdirSync(path.join(__dirname, 'lib')).filter(function (d) {
    return d !== 'init-input.js' && d !== 'selector.js' && d !== 'list.js'
  }).map(function (d) {
    return d.split('.')[0]
  }).join('\n    '), '\n')
}
