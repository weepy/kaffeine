var Token = require("../token");

module.exports = function(stream) {
  var ks = ["if", "for", "while", "catch"]  

  stream.tail().prev.each(function() {
    Token.current_token = this
    
    if(ks.indexOf(this.text) < 0 ) return
    
    
    var n = this.nextNW()
    if(n.lbracket && n.round) return
    
    var pair = Token.bracket.pair("()")
    
    var tok = this
    
    var end = this.find(function(token) {
      if(token.lbracket && token.curly) return true
      if(token.lbracket) return token.matching
      if(token.newline) return true
      if(token.text == ",") {
        if(token.prev.prev != tok) {
          return true
        }
      }
    })
    

    // console.log("end", end.text)
    // var end = this.nextNW().expressionEnd(function() {
    //   if(this.text == ",") return true
    // }).next
    
    if(end.text == ",") {
      end.spitRight()
      end = end.next
      end.prev.remove()
    }

    if(end.operator && !end.unary_operator) {
      end = end.expressionEnd().next
    }
        
    if(!end.whitespace)
      end.spitRight()
    
    if(this.next.whitespace) this.next.remove()
    this.after(pair.L)
    var eaten = pair.L.next.eaten.left[0]
    if(eaten && eaten.space)
      pair.L.next.spitLeft().remove()
  
    var eaten = this.eaten.right[0]
    if(eaten && eaten.space)
      this.spitRight().remove()
    
    var curly = end.curly ? end : null;
    
    if(end.prev.whitespace) end = end.prev
    if(end.operator) {
      end.spit(function() { return this.whitespace})
      end = end.next
    }
    end.before(pair.R)
    
    var eaten = pair.R.prev.eaten.right[0]
    if(eaten && eaten.space) {
      pair.R.prev.spitRight().remove()
      pair.R.after(" ")
    }
    
    if(curly)
      curly.updateBlock()
    //if(end.operator) end.replaceWith(new Token.whitespace(" "))
    
    if(!is_while_after_do(this))
      this.addImpliedBraces()
  }, "prev")
  

}

function is_while_after_do(x) {
  if(x.text != "while") return false

  var prev = x.prevNW()
  return prev.curly && prev.rbracket && prev.matching.prevNW().text == "do"
}

