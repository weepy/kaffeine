var modules = {}

//  only works on node... ?
var file = require("file")

Kaffeine.plugin("common_js", function(stream) {
  var block = new Word("function require(path) { return require.modules[path].call(require.modules) }")
  
  stream.each(function() {
    if(!this.word || this.text != "require") return
    
    var path = this.find(function() { if(this.string) return true }) // path = this.find `true if @string`
    
    if(modules[path]) return
    
    var file = modules[path] = file.readFileSync(path + ".js")
    
    if(!file) {
      file = modules[path] = file.readFileSync(path + ".k")
      file = new Kaffeine(file, {common_js: { modules: modules } }).process() // need to pass in some special options containing the modules we've already loaded ?
    }

    var module_string = "require.modules[" + path + "] = function(exports){\n" + module_string  + "\n}\n"
    
    block.after(new Word(module_string))
  })
  return stream.behind(block)
})
