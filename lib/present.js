var fs = require('fs')
var spawn = require('child_process').spawn
var path = require('path')
var gui = require('@deck/gui')
var es = require('event-stream')

function error () {
  console.error.apply(console, arguments)
  console.error()
  process.exit(1)
}

module.exports = function (deck, argv) {
  var url, pkg, s

  var modDir = (argv._.length < 2)
    ? process.cwd()
    : path.join(process.cwd(), argv._[1])

  if (!fs.existsSync(modDir)) {
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
