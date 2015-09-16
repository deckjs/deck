var tmenu = require('terminal-menu');
var logo = require('nearform-terminal-logo');
var charm = require('charm');
var present = require('./present');

module.exports = function (decks) {
  var charm = require('charm')();
  charm.pipe(process.stdout);

  var menu = tmenu({
    width: 24,
    x: (process.stdout.columns / 2) - 12,
    y: (process.stdout.rows / 2) - (decks.length/2) - 5,
    bg: 'black',
    fg: 'red'
  });

  menu.reset();

  menu.write('\n\n');

  decks.forEach(function(deck) {
    menu.add(deck.replace(/-deck$/, ''));
  })
  menu.add('exit')

  setImmediate(function () {
    charm.position(0, 0);
    logo().split('\n').forEach(function (line) {
      if (line === '\n') {return;}
      charm.write(line + ' \n');
    });
    charm.write('\n');

  })

  menu.on('select', function (deck) {
    if (deck === 'exit') {
      menu.close();
      process.stdin.setRawMode(false);
      process.stdin.end();
      return;
    }

    menu.reset();
    menu.close();
    charm.position(0, 0);
    process.stdin.setRawMode(false);
    process.stdout.write(logo())

    present(deck);
  });

  process.stdin.pipe(menu.createStream()).pipe(process.stdout);
  process.stdin.setRawMode(true);
}
