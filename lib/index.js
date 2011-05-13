var Token = require("./token")

function Kaffeine(options) {
  this.options = options;
}

Kaffeine.fn = Kaffeine.prototype;
Kaffeine.VERSION = "0.0.6";
Kaffeine.plugins = {};

//unless brackets_for_keywords reverse_blocks indented_blocks
var jsp = require("./uglify/parse-js")
var pro = require("./uglify/process")

var defaultDirective = "using multiline_strings string_interpolation arrow ruby_symbols englify hash at class brackets_for_keywords operators block_scope pre_pipe implicit_brackets extend_for prototype super implicit_return pipe bang default_args implicit_vars undouble_brackets"
//class implicit_functions super prototype implicit_return

Kaffeine.fn.compile = function(text, uglify_opts) {
  if(!text.match(/\n$/)) text += "\n"; // trailing newline
  var directive = text.match(/^#\s*([^\n]*)\s*\n/) || [1,defaultDirective];
  var plugins = directive[1].replace(/\s+/g," ").replace(/ $/,"").split(" ");
  text = text.slice(directive[0].length);
  // console.log(text)
  var ret =  this.runPlugins(text, plugins);
  
  if(uglify_opts) {
    
    var ast = jsp.parse(ret) // parse code and get the initial AST

    if(uglify_opts == "uglify") {
      ast = pro.ast_mangle(ast); // get a new AST with mangled names
      ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
      ret = pro.gen_code(ast) // compressed code here
    }
    else if (uglify_opts == "beautify") 
      ret = pro.gen_code(ast, {beautify: true})
  }
  
  return ret
};

Kaffeine.fn.runPlugins = function(text, plugins, options) {
  text = "function(){ " + text + "\n}"; // wrap in closure so we have a global closure and also no problems with start and end of text
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
  return stream.head().collectText().replace(/^function\(\)\{/,"").replace(/\n\}$/,"");
};

// Kaffeine.fn.validate = function(text) {
//   try { 
//     new Function(text)
//   }
//   catch (err) {
//     err.invalidJS = true
//     throw(err);
//   }
//   return text
// }


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
