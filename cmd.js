#!/usr/bin/env node

var electron = /electron/i.test(process.argv[0])
if (electron) {
  require('./')(require('minimist')(process.argv.slice(2)))
}

if (!electron) {
  process.title = 'Deck'
  var spawn = require('child_process').spawn
  spawn(
    require('electron-prebuilt'),
    [__filename].concat(process.argv.slice(2)),
    {
      stdio: [0, 1, 2]
    })
}
