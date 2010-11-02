var Token = require("../token");

exports.async = function(stream) {
  stream.each(function(token) {

    if(token.text != "!") return    
    var lbracket = token.next
    if(!lbracket.lbracket || !lbracket.round) return
    if(!token.prev.word) return
    
    var func = token.expressionStart()
    
    var vars = ""
    if(func.prev.assign) {
      var e = func.prev.prev
      var s = e.expressionStart()
      vars = e.remove(s).collectText()
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
    text = text.replace(/\n/, "\n  ")
    rbracket.before(", function(" + vars + ") {"  + text + " }")
    token.remove()
    return lbracket
  })
}
