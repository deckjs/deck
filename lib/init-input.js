var base = require('@deck/base');
var extend = require('extend-object');
var exec = require('exec-sync');
var fs = require('fs');
var path = require('path');
var argv = config.get('argv');

var scope = argv.scope || '';
var deck = path.join(config.get('dir'), '/deck.md');
var pkg = path.join(config.get('dir'), '/package.json');

pkg = fs.existsSync(pkg) ? require(pkg) : {files:[]};

base.version = '1.0.0';
base.bin = base._bin;
base.dependencies = base._dependencies;

base.files = base._files;

Object.keys(base).forEach(function (k) {
  if (k[0] === '_') {base[k]=null;}
});


if (argv.deck) {
  base.deck = fs.readFileSync(path.join(process.cwd(), argv.deck));
}

if (!fs.existsSync(deck)) {
  fs.writeFileSync(deck, base.deck);
}

base.deck = null;

var allFiles = (pkg.files||[]).concat(base.files).reduce(function(p, c) {
  if (p.indexOf(c) < 0) p.push(c);
  return p;
}, []);


extend(exports, base, pkg);

exports.name =  processName(argv.name) || prompt('name', package.name || basename, processName);

exports.author = argv.author || prompt('author', exec('npm get init.author.name'));

exports.licence = argv.licence || exports.license;

exports.files = allFiles;


function processName(name) {
  if (!name) {return '';}
  if (scope) {
    name = name.replace(RegExp('^' + scope + '/'), '');  
  }
  if (!/-deck$/.test(name)) { name += '-deck'; }
  base.bin["present-" + name] = base.bin["present-base-deck"];
  delete base.bin["present-base-deck"];
  name = scope + name;
  return name;
}
