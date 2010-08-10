require.module('lib/plugins/brackets_for_keywords', function(exports, require) {
//////////////////////


exports.brackets_for_keywords = function(stream, Token) {
  var ks = ["if", "for", "while", "catch", "class" ]
  stream.each(function() {
    if(this.keyword && ks.indexOf(this.text)>= 0 ) {
      var n = this.next
      if(n.lbracket && n.round) return
      
      var pair = Token.bracket.pair("()")
      
      var end = this.find(function(token) {
        if(token.lbracket && token.curly) return true
        if(token.newline) return true
        if(token.operator && token.op == ",") return true
      })
      

      if(this.next.whitespace) this.next.remove()
      this.after(pair.L)
      
      if(end.prev.whitespace) end = end.prev
      end.before(pair.R)
      if(end.operator) end.replaceWith(new Token.whitespace(" "))
    }
  })

}


/////////////////////////
})