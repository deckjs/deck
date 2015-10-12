var fs = require('fs')
var path = require('path')
var init = require('init-package-json')
var argv = require('minimist')(process.argv.slice(2))

module.exports = function () {
  argv.name = argv.name || argv._.slice(1)[0]
  var dir = path.join(process.cwd(), argv.name ? argv.name : '')

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  init(dir, __dirname + '/init-input.js', {dir: dir, argv: argv},
    function (err) {
      if (err) throw err
    })
}
