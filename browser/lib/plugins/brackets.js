require.module('lib/plugins/brackets', function(exports, require) {
//////////////////////


exports.brackets_for_keywords = function(stream, Token) {
  var ks = ["if", "for", "while", "catch"]
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
      
      if(end.prev.whitespace) end = end.prev      
      
      this.after(pair.L)
      if(pair.L.next.whitespace) pair.L.next.remove()
      end.before(pair.R)
      if(end.operator) end.replaceWith(new Token.whitespace(" "))
    }
  })

}


/////////////////////////
})