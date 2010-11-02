require.module('./plugins/brackets_for_keywords', function(module, exports, require) {
// start module: plugins/brackets_for_keywords

var Token = require("../token");

exports.brackets_for_keywords = function(stream) {
  var ks = ["if", "for", "while", "catch", "unless"]  
  // bit cheaty as we shouldn't actually know about unless and class
  // we should really expose these as part of the plugin so they can be added to
  
  stream.each(function() {
    if(this.word && ks.indexOf(this.text)>= 0 ) {
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
      var curly = end.curly ? end : null;
      
      if(end.prev.whitespace) end = end.prev
      if(end.operator) {
        end.spit(function() { return this.whitespace})
        end = end.next
      }
      end.before(pair.R)
      
      if(curly)
        curly.updateBlock()
      //if(end.operator) end.replaceWith(new Token.whitespace(" "))
    }
  })

}


// end module: plugins/brackets_for_keywords
});
