var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var path = require('path');
var spawn = require('child_process').spawn;
var dot = require('dot-stream');
var npm = require('path-to-npm')();

var herr = function(err){}

module.exports = function (argv) {
  var pkg = path.join(process.cwd(), 'package.json');
  var inst;

  if (argv._.length < 2) {
    if (!fs.existsSync(pkg)) {
      return console.error('No deck specified and no package.json in current working directory');
    }

    process.stdout.write('\nfetching dependencies..\n\n');

    inst = spawn('npm', ['install'], {
      stdio: argv.debug ? 'inherit' : 'ignore',
      cwd: process.cwd()
    });

    inst.on('close', function (code) {
      if (code) { 
        console.error('\nFailure, exit code ', code)
        process.exit(code); 
      }
    });

    return;
  }  

  var deck = argv._[argv._.length-1];
  var cwd = process.cwd();
  var dots;

  mkdirp.sync(path.join(cwd, deck.split('/')[0]));

  process.stdout.write('\ninstalling ' + deck + '..');

  dots = dot();
  dots.pipe(process.stdout);

  var args = (argv._.join(' ') + ' --json --prefix ' + path.join(cwd, deck.split('/')[0])).split(' ');

  inst = spawn(npm, args, {
    stdio: argv.debug ? 'inherit' : 'ignore'
  });

  inst.on('close', function (code) {
    if (code) { 
      console.error('\nFailure, exit code ', code)
      process.exit(code); 
    }

    fs.renameSync(path.join(deck.split('/')[0], 'node_modules', deck.replace(/(\/.*)@.*$/, '$1')), 
      path.join(cwd, deck.split('/')[0], (deck.split('/')[1] || deck.split('/')[0])));


    if (deck.split('/')[1]) {
      rimraf(path.join(cwd, deck.split('/')[0], 'node_modules', deck.split('/')[0]), herr);
    }

    rimraf(path.join(cwd, deck.split('/')[0], 'node_modules', '.bin', '*'), function (err) {
      herr(err);
      rimraf(path.join(cwd, deck.split('/')[0], 'node_modules', '.bin'), function (err) {
        herr(err);
        rimraf(path.join(cwd, deck.split('/')[0], 'node_modules'), herr);
      });
    });

    dots.end();
    console.log('\n\ndone\n');
    console.log('next: deck present ' + argv._[argv._.length-1] + ' \n');
  });


}