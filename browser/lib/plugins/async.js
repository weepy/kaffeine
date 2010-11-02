require.module('./plugins/async', function(module, exports, require) {
// start module: plugins/async

var Token = require("../token");

exports.async = function(stream) {
  stream.each(function(token) {

    if(!token.bang) return    
    
    var lbracket = token.next
    
    var func = token.expressionStart()
    
    var vars = ""
    if(func.prev.assign) {
      var e = func.prev.prev
      var s = e.expressionStart()
      vars = s.remove(e).collectText()
      func.prev.remove()
    }
    
    var rbracket = lbracket.matchingBracket
    
    var start_fn = rbracket.next
    var end_fn = start_fn.find(function() {
      if(this.lbracket) return this.matchingBracket.next
      if(this.rbracket) return true
    })
    
    var body = start_fn.remove(end_fn.prev)
    var text = body.collectText()
    text = text.replace("\n", "\n  ", "g")
    rbracket.before(", function(" + vars + ") {"  + text + "  }")
    if(!rbracket.next.newline)
      rbracket.after("\n")
    //token.bang = false
    token.text = token.text.slice(0,token.text.length-1)
    return token.next
  })
}


// end module: plugins/async
});
