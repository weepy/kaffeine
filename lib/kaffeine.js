var Token = require("./token").Token
var sys = require("sys")
var puts = sys.puts

function Kaffeine(options) {
  this.options = options
}

Kaffeine.fn = Kaffeine.prototype
Kaffeine.VERSION = "0.0.1"
Kaffeine.plugins = {}

// Kaffeine.plugin = function(name, fn) {
//   Kaffeine.plugins[name] = fn
// }

Kaffeine.fn.preprocess = function(text) {
  return text.replace(/\t/g, "  ").replace(/\s*\n/g, "\n").replace(/\r\n|\r/g,"").replace(/;([^\n])/g, function(a,b) { return ";\n"+b } )
}

Kaffeine.fn.compile = function(text) {
  text = this.preprocess(text)
  var directive = text.match(/#kaffeine\s*([^\n]*)\s*\n/);
  var plugins = directive[1].split(" ")
  text = text.slice(directive[0].length)
  //text = "//" + text
  return this.runPlugins(text, plugins)
}

Kaffeine.fn.runPlugins = function(text, plugins, options) {
  var stream = Token.ize(text);
  options = options || {}
  
  for(var i=0; i<plugins.length; i++) {
    var name = plugins[i]
    var plugin = Kaffeine.plugins[name]
    if(!plugin) puts(name + " - not loaded") 
    plugin.call(this, stream, Token, options[name] || {})
  }
  return stream.head().allText();
}

exports.Kaffeine = Kaffeine