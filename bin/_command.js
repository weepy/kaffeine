/* The `kaffeine` utility. Handles command-line compilation of Kaffeine
 into various forms = saved into `.js` files or printed to stdout, piped to
 [JSLint](http =//javascriptlint.com/) or recompiled every time the source is
 saved, printed as a token stream or as the syntax tree, or launch an
 interactive REPL. */

// External dependencies.
var fs =        require('fs'),
    path =          require('path'),
    optparse =      require('./optparse'),
    Kaffeine =  require('./kaffeine'),
    spawn = require('child_process').spawn,
    exec = require('child_process').exec

// The help banner that is printed when `coffee` is called without arguments.
var BANNER = "kaffeine compiles Kaffeine source files into JavaScript.\n\
  Usage = \n\
    kaffeine path/to/script.k"

// The list of all the valid option flags that `coffee` knows how to handle.
var SWITCHES = [
  ['-c', '--compile',       'compile to JavaScript and save as .js files'],
  ['-i', '--interactive',   'run an interactive Kaffeine REPL'],
  ['-o', '--output [DIR]',  'set the directory for compiled JavaScript'],
  ['-w', '--watch',         'watch scripts for changes, and recompile'],
  ['-p', '--print',         'print the compiled JavaScript to stdout'],
  ['-l', '--lint',          'pipe the compiled JavaScript through JSLint'],
  ['-s', '--stdio',         'listen for and compile scripts over stdio'],
  ['-e', '--eval',          'compile a string from the command line'],
  [      '--no-wrap',       'compile without the top-level function wrapper'],
  ['-t', '--tokens',        'print the tokens that the lexer produces'],
  ['-n', '--nodes',         'print the parse tree that Jison produces'],
  ['-v', '--version',       'display Kaffeine version'],
  ['-h', '--help',          'display this help message'],
]

// Top-level objects shared by all the functions.
var options = {},
    sources = [],
    optionParser = null

/* Run `coffee` by parsing passed options and determining what action to take.
   Many flags cause us to divert before compiling anything. Flags passed after
  `--` will be passed verbatim to your script as arguments in `process.argv`*/
exports.run = function() {
  parseOptions()
  if(options.help) return usage()                              
  if(options.version) return version()                            
  if(options.interactive) return require './repl'                     
  if(options.stdio) return compileStdio()                      
  if(options.eval) return compileScript('console', sources[0] )
  if(!sources.length) return require './repl'                      
  var separator = sources.indexOf('--')
  var flags = []
  if(separator >= 0) {
    flags = sources.slice((separator + 1), sources.length)
    sources = sources.slice(0, separator-1)
  }
  process.ARGV = process.argv = flags
  compileScripts()
}


/* Asynchronously read in each Kaffeine in a list of source files and
// compile them. If a directory is passed, recursively compile all
// '.coffee' extension source files in it and all subdirectories.*/
function compileScripts() {
  for(var i =0; i< sources.length; i++) {
    var source = sources[i]
    var base = source
    var compile = function(source, topLevel) {
      path.exists(source, function (exists) {
        if(!exists) throw(new Error("File not found = " + source)) 
        fs.stat( source, function(err, stats) {
          if(stats.isDirectory()) {
            fs.readdir(source, function(err, files) {
              for(var j=0; j<files.length) {
                var file = files[j]
                compile(path.join(source, file))
              }
            })
          }
          else if(topLevel || path.extname(source) == '.coffee') {
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
  var codeOpts = compileOptions source
  try {
    if(o.tokens)      printTokens(Kaffeine.tokens, code) 
    else if(o.nodes)  puts( Kaffeine.nodes(code).toString())
    else if(o.run)     Kaffeine.run(code, codeOpts)
    else {
      var js = Kaffeine.compile(code, codeOpts)
      if(o.print)         print(js)
      else if(o.compile)  writeJs(source, js, base)
      else if(o.lint)     lint(js)
    }
  } 
  catch(err) {
    if(!o.watch) {
      require("sys").p(err.stack)
      process.exit(1) 
    }
    puts(err.message)
  }
}
// Attach the appropriate listeners to compile scripts incoming over **stdin**,
// and write them back to **stdout**.
function compileStdio() {
  var code = ''
  var stdin = process.openStdin()
  stdin.addListener('data', function(buffer) {
    if(buffer) code +=  buffer.toString()
  })
  stdin.addListener('end', function(buffer) {
    compileScript('stdio', code)
  })
}

// Watch a source Kaffeine file using `fs.watchFile`, recompiling it every
// time the file is updated. May be used in combination with other options,
// such as `--lint` or `--print`.
function watch(source, base) {
  fs.watchFile(source, {persistent:true, interval: 500}, function(curr, prev) {
    if(curr.mtime.getTime() is prev.mtime.getTime()) return
    fs.readFile(source, function(err, code) { compileScript(source, code.toString(), base)})
  }
}
// Write out a JavaScript source file with the compiled code. By default, files
// are written out in `cwd` as `.js` files with the same name, but the output
// directory can be customized with `--output`.
function writeJs(source, js, base) {
  var filename = path.basename(source, path.extname(source)) + '.js'
  var srcDir =   path.dirname(source)
  var baseDir =  srcDir.substring(base.length)
  var dir =      options.output ? path.join(options.output, baseDir) : srcDir
  var jsPath =   path.join(dir, filename)
  compile =  function() {
    fs.writeFile(jsPath, js, function(err) {
      if(options.compile && options.watch)
        puts("Compiled $source") 
    })
  }
  path.exists(dir, function(exists) {
    exists ? compile() : exec("mkdir -p $dir", compile)
  })    
}

// Pipe compiled JS through JSLint (requires a working `jsl` command), printing
// any errors or warnings that arise.
// lint = (js) ->
//   printIt = (buffer) -> print buffer.toString()
//   jsl = spawn 'jsl', ['-nologo', '-stdin']
//   jsl.stdout.addListener 'data', printIt
//   jsl.stderr.addListener 'data', printIt
//   jsl.stdin.write js
//   jsl.stdin.end()

// Pretty-print a stream of tokens.
function printTokens(tokens) {
  strings = []
  for(var i=0; i< tokens.length; i++) {
    var token = tokens[i]
    var tag = token[0]
    var value = token[1].toString().replace(/\n/, '\\n')
    "[" + tag + " " + value + "]"
  }
  puts(strings.join(' '))
}

// Use the [OptionParser module](optparse.html) to extract all options from
// `process.argv` that are specified in `SWITCHES`.
function parseOptions() {
  var optionParser = new optparse.OptionParser(SWITCHES, BANNER)
  var o = options =  optionParser.parse(process.argv)
  var options.run =   !(o.compile || o.print || o.lint)
  options.print = !!(o.print || (o.eval || o.stdio && o.compile))
  sources = options.arguments.slice(2, options.arguments.length)
}

// The compile-time options to pass to the Kaffeine compiler.
function compileOptions = (source) {
  o = {source = source}
  o['no_wrap'] = options['no-wrap']
  o
}

// Print the `--help` usage message and exit.
usage = ->
  puts optionParser.help()
  process.exit 0

// Print the `--version` message and exit.
version = ->
  puts "Kaffeine version $Kaffeine.VERSION"
  process.exit 0
