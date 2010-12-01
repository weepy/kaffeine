require.module('./command', function(module, exports, require) {
// start module: command

var Kaffeine = require("./kaffeine"),
    fs =             require('fs'),
    path =           require('path'),
    optparse =       require('optparse'),
    util =           require("util"),
    sources = [],
    options = {},
    oparser


function loadPlugins(source) {
  fs.readdir(source, function(err, files) {
    for(var i =0; i< files.length;i++) {
      var file = files[i]
      if(!file.match(/\.js$/)) continue
      file = file.replace(/\.js$/, "")

      var path = "./plugins/" + file
      Kaffeine.plugins[file] = require(path)
    }
  })
}


var SWITCHES = [
  ['-c', '--compile FILES', 'list of kaffeine files or folders to compile (comma seperated)'],
  ['-o', '--output DIR',    'set the directory for compiled JavaScript'],
  ['-w', '--watch',         'watch scripts for changes, and recompile'],
  ['-v', '--version',       'display Kaffeine version'],
  ['-h', '--help',          'display this help message'],
  ['-g', '--growl',         'growl about error\'s in compilation. requires growl notify'],
  ['-j', '--javascript-clientside',    'output clientside javascript version']
]

function parseOptions() {
  oparser = new optparse.OptionParser(SWITCHES, "kaffeine compiles .k files to Kaffeine. run 'kaffeine help' for more info")
  //var o = options =  
  
  // options.run = false //  !(o.compile || o.print || o.lint)
  // options.print = false // !!(o.print || (o.eval || o.stdio && o.compile))
  //console.log(process.argv)
  //sources = options.slice(2, options.length)
  
  oparser.on('compile', function(o, s) {
    sources = s.split(",")
    options.compile = true
  });
  
  oparser.on('help', function(sources) {
    options.help = true
  });
  
  oparser.on('watch', function(sources) {
    options.watch = true
  });
  
  oparser.on('output', function(o, dir) {
    options.output = dir
  })
  oparser.parse(process.argv)
}

exports.run = function() {
  parseOptions()
  loadPlugins(__dirname + "/plugins")
  
  if(options.help) return usage()                              
  if(options.version) return version()                            
  /*var separator = sources.indexOf('--')
  var flags = []
  if(separator >= 0) {
    flags = sources.slice((separator + 1), sources.length)
    sources = sources.slice(0, separator-1)
  }
  process.ARGV = process.argv = flags*/
  compileScripts()
}

function usage() {
  console.log(oparser.toString())
  process.exit(0)
}

function version() {
  console.log("Kaffeine version " + Kaffeine.VERSION)
  process.exit(0)
}


function compileScripts() {
  
  for(var i =0; i < sources.length; i++) {
    var source = sources[i]
    var base = source
    var compile = function(source, topLevel) {
      
      path.exists(source, function (exists) {
        if(!exists) throw(new Error("File not found = " + source)) 
        fs.stat( source, function(err, stats) {
          if(stats.isDirectory()) {
            fs.readdir(source, function(err, files) {
              for(var j=0; j<files.length;j++) {
                var file = files[j]
                compile(path.join(source, file))
              }
            })
          }
          else if(topLevel || path.extname(source) == '.k') {
            fs.readFile(source, function(err, code) { compileScript(source, code.toString(), base) })
            if(options.watch) watch(source, base)
          }
        })
      })
    }
    compile(source, true)
  }
}

// Compile a single source script, containing the given code, according to the
// requested options. If evaluating the script directly sets `__filename`,
// `__dirname` and `module.filename` to be correct relative to the script's path.
function compileScript(source, code, base) {
  var o = options
  try {
    var js = new Kaffeine().compile(code)
    if(o.print)         print(js)
    else if(o.compile)  writeJs(source, js, base)
  } 
  catch(err) {
    if(!o.watch) {
      console.log(err.stack)
      process.exit(1) 
    }
    console.log(err.message)
  }
}

// Write out a JavaScript source file with the compiled code. By default, files
// are written out in `cwd` as `.js` files with the same name, but the output
// directory can be customized with `--output`.
function writeJs(source, js, base) {
  var filename = path.basename(source, path.extname(source)) + '.js'
  var srcDir   = path.dirname(source)
  var baseDir  = srcDir.substring(base.length)
  var dir      = options.output ? path.join(options.output, baseDir) : srcDir
  var jsPath   = path.join(dir, filename)
  var compile  = function() {
    fs.writeFile(jsPath, js, function(err) {
      if(options.compile && options.watch) console.log("Compiled " + source) 
    })
  }
  path.exists(dir, function(exists) {
    exists ? compile() : exec("mkdir -p " + dir, compile)
  })    
}

function watch(source, base) {
  fs.watchFile(source, {persistent: true, interval:  500}, function(curr, prev) {
    if(curr.mtime.getTime() === prev.mtime.getTime()) return
    fs.readFile(source, function(err, code) { compileScript(source, code.toString(), base)})
  })
}

// end module: command
});
