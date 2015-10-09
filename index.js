var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var logo = require('nearform-terminal-logo').toTTY;
var prompt = require('sync-prompt').prompt;
var upstream = require('@deck/upstream');
var npm = require('path-to-npm')();

function arg(p) {
  return !!~arg.s.indexOf(p);
}

module.exports = function(argv) {
  var scope;
  arg.s = argv._;

  scope = argv.scope || '@nearform';

  if (scope[0] !== '@') { scope = '@' + scope; }

  logo({leftPadding: 4, text: '  Deck'});

  if (arg('init')) {
    return require('./lib/init')();
  }

  if (arg('install') || arg('i') || arg('inst')) {
    return require('./lib/install')(argv);
  }

  if (arg('present') || arg('view')) {
    return require('./lib/present')(argv._[argv._.length-1], argv);
  }

  // if (arg('list')) {
  //   return require('./lib/list')();
  // }

  if (arg('edit')) {
    require('./lib/edit')(argv._[argv._.length-1], argv);
  }

  if (arg('publish') || arg('pub')) {
    if (!RegExp('^' + scope).test(require(process.cwd() + '/package.json').name)) {
      throw Error('Package must be scoped to ' + scope);
    }

    return spawn(npm, argv._, { customFds: [0, 1, 2] });
  }

  var deck = {};
  if (arg('upstream') || arg('up')) {
    if (!/-deck$/.test(argv._[argv._.length-1])) {
      argv._[argv._.length-1] += '-deck';
    }
    deck.remote = argv._[argv._.length-1];
    if (!/^@nearform\//.test(argv._[argv._.length-1])) {
      argv._[argv._.length-1] = '@nearform/' + argv._[argv._.length-1];
    }
    deck.local = argv._[argv._.length-1];

    var msg = prompt('Enter PR Message: ');

    upstream(deck, msg, function (err, url) {
      if (err) {
        return console.error(err);
      }
      console.log(url);
    });
    return;
  }

  console.log('  Commands:\n');
  console.log('   ', fs.readdirSync(path.join(__dirname, 'lib')).filter(function (d) {
    return d !== 'init-input.js' && d !== 'selector.js';
  }).map(function (d) { return d.split('.')[0]; }).join('\n    '), '\n');
};
