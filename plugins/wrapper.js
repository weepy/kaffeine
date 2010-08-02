// this is a bit cheaty, as we should really build a token stream
// but it makes not difference if it's the last plugin 
Kaffeine.plugin("wrapper", function(stream) {
  stream.before(new Word(";(function(){\n"))
  stream.after(new Word("\n})();"))
})



/*
function require(name) {
  return require.modules[name] = require.modules[name] || {}
}
require.modules = {}

(function(exports) {
  exports.x = M
})(require("./filename"))

*/
