// EXAMPLE
// brequire.compile("./public/js/mmmodel/", "*").name().write("./public")

var fs = require("fs"),
    path = require("path"),
    glob = require("glob").globSync

function compile(root) {
  if(this.constructor != compile) return new compile(root)
  this.search_paths = ["**.js"]
  this.src(root)
}

compile.prototype.src = function(root) { 
  if(root.match(/^[\.~\\]/)){ // i.e starts with / . or ~
    this._module_base = "./"
    
    var p = path.resolve(root)  
    
    if(fs.statSync(p).isFile()) {
      this.root = path.dirname(p) 
      this.search_paths = [path.basename(p)]
    } else {
      this.root = p
    }
    
  }
  else { // global 
    this._module_base = root + "/"
    this.root = path.dirname(require.resolve(root))
  }
  return this
}

compile.prototype.search = function() {
  this.search_paths = Array.prototype.slice.call(arguments)
  return this
}

compile.prototype._files = function() {
  var files = []
  
  for(var i=0; i < this.search_paths.length; i++) {
    
    var p = path.join(this.root, this.search_paths[i])
    var x = glob(p)
    files = files.concat(x)
  }
  
  var ret = []
  for(var i=0; i<files.length;i++) {
    if(!fs.statSync(files[i]).isFile()) continue
    ret.push(files[i].replace(this.root + "/", ""))
  }
  
  return ret
}

function join() {
  var args = []
  for(var i =0; i< arguments.length; i++) 
    args.push(arguments[i])
  
  return args.join("/").replace(/\/\//g, "/").replace(/\/$/, "")
}

compile.prototype._modules = function() {
  var files = this._files(), ret = []
  for(var i =0; i< files.length; i++)
    ret.push(join(this._module_base, files[i]) )
  return ret
}
  
compile.prototype.module_base = function(n) {
  this._module_base = join(n,"/")
  return this
}

compile.prototype.include_lib = function() {
  this._client_lib = fs.readFileSync(__dirname + "/../browser/brequire.js")
  return this
}

compile.prototype.inspect = function() {
  
  console.log({
    files: this._files(),
    module_base: this._module_base,
    include_client_lib: !!this._client_lib,
    search_paths: this.search_paths
  })
  return this
}

compile.prototype.write = function(path) {
  if(!path) return this
  
  var files = this._files()    
  if(path.match(/\.js$/) ) {
    
    var js = this.toString()

    var filename = path //join(dir, this._bundle)
    mkDirTree(filename)
    fs.writeFileSync(filename, js)
  } 
  else {
    for(var i =0; i< files.length; i++) {
      var module = join(this._module_base, files[i]) //.replace(/\.js$/,"") // leave off the ending .js
      var txt = fs.readFileSync(join(this.root, files[i])).toString()
      if(files[i].match(/\.k$/)) {
        txt = (new (require("kaffeine"))()).compile(txt)
        module = module.replace(/\.k$/, ".js")
        files[i] = files[i].replace(/\.k$/, ".js")
      }
      
      var js = wrap( module, txt)
    
      var out = join(path, files[i])
      
      mkDirTree(out)   
      fs.writeFileSync(out, js)
    }
    if(this._client_lib) fs.writeFileSync(join(path, "brequire.js"), this._client_lib)
  }
  
  return this
}

compile.prototype.toString = function() {
  var js = this._client_lib || ""
   var files = this._files() 

  for(var i =0; i< files.length; i++) {
    var module = join(this._module_base, files[i]) //.replace(/\.js$/,"") // leave off the ending .js
    // console.log(join(this.root, files[i]))
    var txt = fs.readFileSync(join(this.root, files[i])).toString()
    
    if(files[i].match(/\.k$/)) {
      txt = (new (require("kaffeine"))()).compile(txt)
      module = module.replace(/\.k$/, ".js")
    }
    
    js += wrap(module, txt) + ";\n\n" 
  }
  return js
}
  


function mkDirTree(_path) {
  var p = path.dirname(_path).split("/") 
  var x = "", y
  while((y = p.shift()) != null) {
    x += y  
    if(!path.existsSync(x)) {
      fs.mkdirSync(x, 0775)
    }
    x += "/"
  }
}


function wrap(file, text) {
  return "require.register('" + file + "', function(module, exports, require) {\n// start module: " + file + "\n\n" + text + "\n\n// end module: "+ file +"\n});\n"
}

module.exports = compile
exports.wrap = wrap