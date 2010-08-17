require.module('./plugins/pipe', function(module, exports, require) {
// start module: plugins/pipe

var Token = require("../token");
exports.pipe = function(stream) {

  stream.each(function() {
    if(this.operator && this.op == "|") {
      var L = this.expressionStart()
      var fn = this.next
      var r = fn.next
      if(!r.lbracket) {
        var pair = Token.bracket.pair("()")
        fn.after(pair.L).after(pair.R)
        r = pair.R
      } else {
        r = r.matchingBracket
      }
            
      var R = r.next.next.find(function() {
        if((this.next.whitespace && this.text != "return") || this.next.op == "|") return true
      })

      var rhs = r.next.next.remove(R)
      var lhs = L.remove(this.prev)
      
      var cont = r.next

      r.prev.after(new Token.word(lhs.collectText())).after(new Token.operator(",")).after(rhs)
      r.next.remove()
      this.remove()
      return r
    }
  }) 
}

// end module: plugins/pipe
});
