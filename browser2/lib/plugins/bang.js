require.module('./plugins/bang', function(module, exports, require) {
// start module: plugins/bang

var Token = require("../token");

module.exports = function(stream) {
  stream.each(function(token) {

    if(!token.bang) return    
    
    var lbracket = token.next
    
    var func = token.expressionStart()
    
    var indent = token.indent()
    
    var vars = ""
    if(func.prev.assign) {
      var e = func.prev.prev
      var s = e.expressionStart()
      vars = s.remove(e).collectText()
      func.prev.remove()
    }
    
    var rbracket = lbracket.matching
    
    var start_fn = rbracket.next
    var end_fn = start_fn.find(function() {
      if(this.lbracket) return this.matching.next
      if(this.rbracket) return true
    })
    
    var body = start_fn.remove(end_fn.prev)
    
    var fn = this.findClosure()
    body.find(function() {
      if(this.was_at_symbol) {
        var ffn = this.findClosure()
        if(!ffn) {
          fn.vars._this = "this"
          this.text = "_this"
        }
      }
    })
    
    body = body.collectText()
    var endsWithNL = body.match(/\n *$/)
    body = body.replace(/\n/g, "\n  ")
    // if(!body.match(/\n$/))
    //       body += "\n"
    //     body += indent
    body += " "
    
    body = body.replace(/\s*\n( *)$/, function(a, b) { 
      return "\n" + b;
    })
    

    if(!endsWithNL)
      body = body.replace(/\n *$/, " ") 
    var text = "function(" + vars + ") {"  + body + "}"
    
    if(lbracket.next != rbracket)
      text = ", " + text
    
    var tokens = Token.ize(text)
    tokens.banged_function = true
    
    rbracket.before(tokens)
    // if(!rbracket.next.newline)
    //   rbracket.after("\n")
    //token.bang = false
    token.text = token.text.slice(0,token.text.length-1)
    return token.next
  })
}


// end module: plugins/bang
});
