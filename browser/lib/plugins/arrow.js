require.module('./plugins/arrow', function(module, exports, require) {
// start module: plugins/arrow

var Token = require("../token");

exports.arrow = function(stream) {
  stream.each(function(token) {
    
    if(!token.operator || token.op != "->") return
    
    var args = "()"
    
    if(token.prev.rbracket) {
      var from = token.prev.matchingBracket
      if(!from) throw "not matching !"
      if(from.prev.word) from = from.prev
      args = from.remove(token.prev).collectText()
    }
    
    var text = this.myText().replace("->", "function" + args)
    var toks = Token.ize(text)
    this.before(toks)
    this.remove()
    return toks
  })
}


// end module: plugins/arrow
});
