var npm = require('path-to-npm')()
var spawn = require('child_process').spawn

function publish (argv, scope) {
  if (!RegExp('^' + scope).test(require(process.cwd() + '/package.json').name)) {
    throw Error('Package must be scoped to ' + scope)
  }

  return spawn(npm, argv._, { customFds: [0, 1, 2] })
}

module.exports = publish
