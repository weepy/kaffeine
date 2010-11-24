require.module('./plugins/operators', function(module, exports, require) {
// start module: plugins/operators

var Token = require("../token");
module.exports = function(stream) {
  stream.each(function(token) {
    if(!token.operator) return
    
    if(token.text == "||=")
      var op = "|| "
    else if(token.text == ".=")
      var op = "."
    else return
    
    token.after(op)  
    token.text = "="

    var lhs = "" 
    token.prev.findRev(function(token) {
      if(token.whitespace || token.unknown) return true
      lhs = token.text + lhs
    })

    if(op != "." ) lhs += " "

    var tokens = Token.ize(lhs)
    token.after(tokens, tokens.tail())
    
  })
  
  // extend
  var inserted = false
  stream.each(function(token) {
    if(token.text != "<-") return 
    var arrow = this
    var L = this.expressionStart()
    var lhs = L.remove(arrow.prev).collectText()

    var R = arrow.next.expressionEnd(function() {
    })

    var rhs = arrow.next.remove(R).collectText()
    var ret = arrow.prev
    arrow.replaceWith("__extend(" + lhs + ", " + rhs + ")")
    //token.global.vars['__extend'] = __extend.toString()
    
    if(!inserted) {
      var g = stream.block
      if(!g.global) throw "WTF!"
      g.matching.before(__extend.toString() + "\n")
      inserted = true
    }
    return ret
  })
}

function __extend(a,b) {
  var c = {}
  a = a || {}
  for(var i in b) c[i] = b[i]
  for(var i in a) c[i] = a[i]
  return c
}

// end module: plugins/operators
});
