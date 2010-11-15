var Token = require("../token");

module.exports = function(stream) {
  var ks = ["if", "for", "while", "catch"]  

  stream.each(function() {
    if(ks.indexOf(this.text) < 0 ) return
    
    var n = this.next
    if(n.lbracket && n.round) return
    
    var pair = Token.bracket.pair("()")
    
    var end = this.find(function(token) {
      if(token.lbracket && token.curly) return true
      if(token.lbracket) return token.matchingBracket
      if(token.newline) return true
//        if(token.operator && token.op == ",") return true
    })

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
    
    this.markBracelessBlock()
  })

}
