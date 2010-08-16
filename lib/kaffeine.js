var Token = require("./token").Token;

function Kaffeine(options) {
  this.options = options;
}

Kaffeine.fn = Kaffeine.prototype;
Kaffeine.VERSION = "0.0.1";
Kaffeine.plugins = {};

Kaffeine.fn.preprocess = function(text) {
  return text.replace(/\t/g, "  ").replace(/ *\n/g, "\n").replace(/\r\n|\r/g,"");
  //.replace(/;([^\n])/g, function(a,b) { return ";\n"+b } )   <=== semi's in for blocks is OK
};

Kaffeine.fn.compile = function(text) {
  text = this.preprocess(text);
  var directive = text.match(/#\s*([^\n]*)\s*\n/);
  var plugins = directive[1].replace(/\s+/g," ").replace(/ $/,"").split(" ");
  text = text.slice(directive[0].length);
  //text = "//" + text
  var ret =  this.runPlugins(text, plugins);
  ret = this.validate(ret)
  return ret
};

Kaffeine.fn.runPlugins = function(text, plugins, options) {
  text = "function(){\n" + text + "\n}"; // wrap in closure so we have a global closure and also no problems with start and end of text
  var stream = Token.ize(text);
  
  stream.global = stream.find(function() { 
    if(this.curly) {
      return true;
    }
  });
  stream.global.global = true;

  // set outer closure as global
  
  options = options || {};
  
  for(var i=0; i<plugins.length; i++) {
    var name = plugins[i];
    var plugin = Kaffeine.plugins[name];
    if(!plugin) {
      throw(name + " - not loaded");
    }
    plugin.call(this, stream, Token, options[name] || {});
  }
  
  
  return stream.head().collectText().replace(/^function\(\)\{\n/,"").replace(/\n\}$/,"");
};

Kaffeine.fn.validate = function(text) {
  if(typeof window == "undefined") {
//     try { 
//       js = "function validate(){\n" + text + "\n}" // parse but don't run the code
//   //    process.binding('evals').Script.runInThisContext(js, 'eval'); 
//     }
//     catch (err) {
//       var lineNumber = /\s+at eval:(\d+):.+\n/mi.exec(err.stack)[1]; 
//       console.log(lineNumber); // 3
// //      console.log(err.stack);
//    }
  }
  else {
    try { 
      new Function(text)
    }
    catch (err) {
      console.log(err.stack);
    }     
  }
  return text
}

exports.Kaffeine = Kaffeine;