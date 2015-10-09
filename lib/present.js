var fs = require('fs');
var spawn = require('child_process').spawn;
var path = require('path');
var gui = require('@deck/gui');
var ed = require('./edit');
var es = require('event-stream');
var which = require('which');

module.exports = function (deck, argv) {
  var url, pkg;
  var actions = {
    3: process.exit,
    111: function open() {
      gui(url.local);
    },
    101: function edit() {
      ed(deck, argv);
    },
    116: function tslide() {
      console.log('todo');
    },
    27: function send(key) {
      console.log(key);
      //send arrow key to browser
    }
  };


  if (argv._.length < 3) {
    pkg = path.join(process.cwd(), 'package.json');

    if (!fs.existsSync(pkg)) {
      return console.error('No deck specified, and not not in a deck folder');
    }

    pkg = require(pkg).name;

    argv._.push(pkg);
  }

  var mod = argv._[argv._.length-1];
  var s;

  if (pkg) {
    s = path.join(process.cwd(), 'node_modules', '.bin', 'present');

    if (!fs.existsSync(s)) {
      return console.error('Do you need to do a "deck install" in this directory?');
    }
  } else {
    s = which.sync('present-' + (mod.split('/')[1] || mod));
  }

  if (!fs.existsSync(s)) {
    return console.error('  %s not found in current working directory or globally\n\n  try:\n    deck install %s\n',
    mod, mod);
  }


  process.stdout.write('preparing...');

  var present = spawn(s, {
    stdio: ['pipe', 'pipe', 2]
  });


  if (argv.debug) {
    present.stdout.pipe(process.stdout);
  }

  present.stdout
    .pipe(es.split())
    .pipe(es.parse())
    .pipe(es.through(function (o) {
      if (o.pids) {
        process.on('exit', function () {
          o.pids.forEach(function (pid) {
            process.kill(pid);
          });
        });
      }
      if (o.url) {

        url = {
          remote: o.url,
          local: 'http://localhost:' + o.port
        };

        ready();
        this.queue('Local: ' + url.local);
        return this.queue('Remote: ' + url.remote);
      }
      this.queue(o);
    }))
    .pipe(es.stringify())
    .pipe(process.stdout);


  process.on('exit', function () {
    present.kill();
  });


  function ready() {
    process.stdout.write('..ready\n');

    process.stdin.setRawMode(true);
    process.stdin.on('data', function (key) {
      var code = +key[0];
      actions[code] && actions[code](key);
    });

    console.log('\nCommands:\n');
    console.log(Object.keys(actions).map(function (code) {
      if (code < 65 || code > 122) { return ''; }
      var key = String.fromCharCode(code);
      return '    ' + key + ': ' + actions[code].name;
    }).filter(Boolean).join('\n') + '\n');
  }
};
