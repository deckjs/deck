var exec = require('exec-sync')
var editor = require('editor')
var fs = require('fs')
var path = require('path')

function edit (deck, argv) {
  var ed = exec('npm get editor')
  var f = argv._.length < 3
    ? path.join(process.cwd(), 'deck.md')
    : path.join(exec('npm get prefix'), 'deck.md')

  if (!fs.existsSync(f)) {
    return console.error('Cannot find deck at', f)
  }

  editor(f, {
    editor: ed || process.env.EDITOR
  })
}

module.exports = edit
