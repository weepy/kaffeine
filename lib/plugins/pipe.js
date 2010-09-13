var Token = require("../token");
exports.pipe = function(stream) {

  stream.each(function() {
    if(this.operator && (this.text == "|" || this.text == "|.")) {
      var L = this.expressionStart()
      
      if(this.text=="|." || this.next.assign) {
        this.text = "_pipe" + this.text.slice(1)
        delete this.operator 
        this.word = true
        return 
      }
      
      if(this.text != "|")
        throw("unknown pipe operation")
      
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
      L.before("_pipe.")
      var lhs = L.remove(this.prev)
      
      var cont = r.next

      r.prev.after(new Token.word(lhs.collectText())).after(new Token.operator(",")).after(rhs)
      r.next.remove()
      this.remove()
      return r
    }
  }) 
}