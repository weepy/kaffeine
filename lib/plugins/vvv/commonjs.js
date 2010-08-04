var CommonModules = {}

//  only works on node... ?
var file = require("file")

Kaffeine.plugin("common_js", function(stream, options) {
  var block = new Word("function require(path) { return require.modules[path].call(require.modules) }"),
      modules = options.modules || CommonModules,
      path, code
  
  stream.each(function() {
    if(!this.word || this.text != "require") return
    
    path = this.find(function() { if(this.string) return true }) 
    if(!modules[path]) {
      code = "require.modules[" + path + "] = function(exports){\n" + loadJS()  + "\n}\n"
      block.after(new Word(code))            
    }
  })
  return stream.behind(block)
})

function loadJS(path) {
  var text = modules[path] = file.readFileSync(path + ".js")
  if(text) return text
  text = modules[path] = file.readFileSync(path + ".k")
  if(!text) throw "can't find src file at " + path
  return new Kaffeine({common_js: { modules: modules }}).process(text)
}
