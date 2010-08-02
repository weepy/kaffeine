Kaffeine = { plugins:{} }

Kaffeine.plugin = function(name, fn) {
  Kaffeine.plugins[name] = fn
}

Kaffeine.preprocess = function(text) {
  return text.replace(/\t/g, "  ").replace(/\s*\n/g, "\n").replace(/\r/g,"").replace(/;([^\n])/g, function(a,b) { return ";\n"+b } )
}

Kaffeine.process = function(text) {
  text = Kaffeine.preprocess(text)
  var directive = text.match(/#kaffeine\s*([^\n]*)\s*\n/);
  var plugins = directive[1].split(" ")
  text = text.slice(directive[0].length)
  //text = "//" + text
  return Kaffeine.convert(text, plugins)
}

Kaffeine.convert = function(text, plugins) {
  var stream = Token.ize(text);
  for(var i=0; i<plugins.length; i++) {
    var plugin = plugins[i];
    Kaffeine.plugins[plugin](stream)
  }
  return stream.head().allText();
}

String.prototype.trim = function() {
  return this.replace(/^\s*/,"").replace(/\s*$/,"")
}
