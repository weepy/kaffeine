var Token = require("../token");
module.exports = function(stream) {

  stream.each(function() {
    if(this.operator && (this.text == "|" || this.text == "|.")) {
      var L = this.expressionStart()
      
      if(this.text=="|." || this.next.assign) {
        this.text = "__" + this.text.slice(1)
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
      
      
      
      
      var R = r.next.next.expressionEnd(function() {
//        if(this.block) return this.block
//        if(this.lbracket) return this.matchingBracket
//        if((this.next.whitespace && this.text != "return") || this.next.op == "|") return true
        return this.text == "|"
      })

      var rhs = r.next.next.remove(R)
      L.before("__.")
      
      var lhs = L.remove(this.prev)
      
      var cont = r.next
      
      fn.after(".call")
      r.prev.after("this, ").after(new Token.word(lhs.collectText())).after(", ").after(rhs)
      r.next.remove()
      this.remove()
      return r
    }
  }) 
}