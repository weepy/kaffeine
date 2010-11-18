require.module('./plugins/implicit_functions', function(module, exports, require) {
// start module: plugins/implicit_functions

var Token = require("../token");

module.exports = function(stream) {
  stream.each(function(token) {
    
    if(token.blockType != "object") return
    if(token.next == token.matching) return // empty object    
    if(token.nextNW().next.text == ":") return // must be an object
    
    var text = "function"
    var prev = token.prevNW()
    
    if(prev.text == ")")
      prev.matching.before("function")
    else
      token.before("function() ")
    
    token.updateBlock()
  })
}


// end module: plugins/implicit_functions
});
