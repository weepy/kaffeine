var Token = require("./token")

function Kaffeine(options) {
  this.options = options;
}

Kaffeine.fn = Kaffeine.prototype;
Kaffeine.VERSION = "0.0.2";
Kaffeine.plugins = {};

//unless brackets_for_keywords reverse_blocks indented_blocks

var defaultDirective = "hash at operators brackets_for_keywords prototype implicit_functions extend_for pre_pipe implicit_brackets implicit_return pipe bang implicit_vars multiline_strings string_interpolation"

Kaffeine.fn.compile = function(text, validate) {
  if(!text.match(/\n$/)) text += "\n"; // trailing newline
  var directive = text.match(/^#\s*([^\n]*)\s*\n/) || [1,defaultDirective];
  var plugins = directive[1].replace(/\s+/g," ").replace(/ $/,"").split(" ");
  text = text.slice(directive[0].length);
  var ret =  this.runPlugins(text, plugins);
  // if(validate)
  //   ret = this.validate(ret)
  return ret
};

Kaffeine.fn.runPlugins = function(text, plugins, options) {
  text = "function(){\n" + text + "\n}"; // wrap in closure so we have a global closure and also no problems with start and end of text
  var stream = Token.ize(text);
  //stream = Token.postprocess(stream);
  
  this.currentStream = stream
  
  stream.global = stream.find(function() { 
    if(this.curly) {
      return true;
    }
  });
  stream.global.global = true;

  options = options || {};
  
  for(var i=0; i<plugins.length; i++) {
    var name = plugins[i];
    var plugin = require("./plugins/"+name) //Kaffeine.plugins[name];
    if(!plugin) {
      throw(name + " - not loaded");
    }
    try {
      plugin.call(this, stream, Token, options[name] || {});     
      //stream.normalize() 
    } 
    catch(err) {
      err.plugin = name
      throw(err)
    }
  }
  return stream.head().collectText().replace(/^function\(\)\{\n/,"").replace(/\n\}$/,"");
};

Kaffeine.fn.validate = function(text) {
  try { 
    new Function(text)
  }
  catch (err) {
    err.invalidJS = true
    throw(err);
  }
  return text
}


//Kaffeine.plugins[p] = require("./plugins/"+p)[p]

if(require.extensions) {
  require.extensions['.k'] = function(module, filename) {
    var fs = require('fs'),
        input = fs.readFileSync(filename, 'utf8'),
        content = (new Kaffeine()).compile(input)
    module.filename = filename + " (compiled)"
    module._compile(content, module.filename)
  }
}


module.exports = Kaffeine;