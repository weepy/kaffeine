require.module('./plugins/brackets_for_keywords', function(module, exports, require) {
// start module: plugins/brackets_for_keywords

var Token = require("../token");

module.exports = function(stream) {
  var ks = ["if", "for", "while", "catch"]  

  stream.each(function() {
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
    
    // var end = this.nextNW().expressionEnd(function() {
    //   if(this.text == ",") return true
    // }).next
    
    if(end.text == ",") {
      end.spitRight()
      end = end.next
      end.prev.remove()
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
    
    this.addImpliedBraces()
  })

}


// end module: plugins/brackets_for_keywords
});
