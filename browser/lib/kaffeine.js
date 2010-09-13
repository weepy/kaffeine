require.module('./kaffeine', function(module, exports, require) {
// start module: kaffeine

var Token = require("./token")

function Kaffeine(options) {
  this.options = options;
}

Kaffeine.fn = Kaffeine.prototype;
Kaffeine.VERSION = "0.0.1";
Kaffeine.plugins = {};

//unless brackets_for_keywords reverse_blocks indented_blocks

var defaultDirective = "englify backticks pipe arrow at unless brackets_for_keywords reverse_blocks class indented_blocks class_part2 prototype super indented_objects missing_commas extend_for brackets_for_functions existential implicit_vars implicit_return implicit_object_keys multiline_strings half_operators double_brackets"

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
    var plugin = Kaffeine.plugins[name];
    if(!plugin) {
      throw(name + " - not loaded");
    }
    try {
      plugin.call(this, stream, Token, options[name] || {});      
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

exports.Kaffeine = Kaffeine;


// end module: kaffeine
});
