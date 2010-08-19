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
    
    var text = "function" + args //token.text.replace("->", )
    // var toks = Token.ize(text)
    this.prev.after(text)
    
    // var newCurly = this.find(function(token) {
    //       if(token.curly) {
    //         token.updateBlock()
    //         return false
    //       }
    //       return true
    //     })
    //     
    //     if(newCurly) {
    //       var pair = Token.bracket.pair("{}")
    //       newCurly.before(pair.L)
    //       var newline = newCurly.find(function(token) { if(token.newline) return true }) || newCurly.tail()
    //       newline.before(pair.R)
    //       pair.L.updateBlock()
    //     }
    
    var ret = this.next
    this.remove()
    return ret
  })
}


// end module: plugins/arrow
});
