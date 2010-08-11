// Brequire - providing CommonJS require support for the browser
// simple library providing CommonJS require support for the browser
function require(path) {
  var module = require.modules[path]
  if(!module) console.log("couldn't find module for: " + path)
  if(!module.exports) {
    module.exports = {}
    module.call(module.exports, module.exports, bind(path))
  }
  return module.exports
}

require.modules = {}

function bind(path) {
  var cwd = path.replace(/[^\/]*$/,"")
  return function(p) {
    p = (cwd + p).replace(/\/\.\//, "/").replace(/[^/]*\/\.\./,"").replace(/\/\//,"/")
    return require(p)
  }  
}

require.module = function(path, fn) {
  require.modules["./" + path] = fn
}
// // simple library providing CommonJS require support for the browser
// 
// function require(path) {
//   var module = require.modules[path]
//   if(module)  
//     module.call(this, this, bind(path))
//   else
//     console.log("Failed loading module: " + path)
//   return this
// }
// 
// require.modules = {}
// 
// function bind(path) {
//   var cwd = path.replace(/[^\/]*$/,"")
//   return function(p) {
//     p = (cwd + p).replace(/\/\.\//, "/").replace(/[^/]*\/\.\./,"").replace(/\/\//,"/")
//     return require(p)
//   }  
// }
// 
// require.module = function(path, fn) {
//   require.modules["./" + path] = fn
// }
