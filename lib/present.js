var fs = require('fs')
var spawn = require('child_process').spawn
var path = require('path')

var es = require('event-stream')
var tunl = require('tunl')

var gui = require('@deck/gui')

module.exports = function (deck, argv) {
  var url, pkg, s

  if (argv.tunnel) { tunnel(argv) }

  var modDir = (argv._.length < 2)
    ? process.cwd()
    : path.join(process.cwd(), 
      argv._[1].trim() === '!' 
      ? path.relative(process.cwd(), fs.readFileSync(path.join(__dirname, '..', 'last-installed-deck')) + '')
      : argv._[1]
    )

  if (!/-deck$/.test(modDir) && !fs.existsSync(modDir)) {
    modDir += '-deck'
  }

  if (!fs.existsSync(modDir)) {
    return error('Specified path does not exist', modDir)
  }

  pkg = path.join(modDir, 'package.json')

  if (!fs.existsSync(pkg)) {
    return error('Not a deck folder')
  }

  pkg = require(pkg).name

  if (!pkg) {
    return error('decks package.json requires a name')
  }

  argv._.push(pkg)

  s = path.join(modDir, 'node_modules', '.bin', 'present')

  if (!fs.existsSync(s)) {
    return error(`
      Cannot find present executable, do you need to do
      a "deck install" in ${modDir}
    `)
  }

  process.stdout.write('preparing...')

  var present = spawn(s, {
    stdio: ['pipe', 'pipe', 2]
  })

  if (argv.debug) {
    present.stdout.pipe(process.stdout)
  }

  present.stdout
    .pipe(es.split())
    .pipe(es.parse())
    .pipe(es.through(function (o) {
      if (o.pids) {
        process.on('exit', function () {
          o.pids.forEach(function (pid) {
            process.kill(pid)
          })
        })
      }
      if (o.url) {
        url = {
          remote: o.url,
          local: 'http://localhost:' + o.port
        }

        ready()
        this.queue('Local: ' + url.local)
        return this.queue('Remote: ' + url.remote)
      }
      this.queue(o)
    }))

  process.on('exit', function () {
    present.kill()
  })

  function ready () {
    process.stdout.write('..ready\n')
    gui(url.local)
  }
}

function error () {
  console.error.apply(console, arguments)
  console.error()
  process.exit(1)
}

function tunnel (argv) {
  if (!argv.key) {
    error(`Need a key file to tunnel through ${argv.tunnel}`)
  }
  var tuple = argv.tunnel.split('@')
  var user = tuple[0]
  var host = tuple[1]

  tunl({
    map: {
      2000: 2000,
      9998: 9999,
      35728: 35729
    },
    ssh: {
      host: host,
      username: user,
      key: argv.key
    }
  }).on('ready', () => console.log('tunnel up\n'))
    .on('end', () => console.log('tunnel closed\n'))
    .on('error', err => console.error('tunnel error\n', err))
}
