var Token = require("../token");
exports.existential = function(stream) {
  stream.each(function() {
    if(this.operator && this.op.match(/^\?/) && !this.prev.whitespace) { // don't want to match ternary
      if(this.op == "??") {
        var toks = Token.ize("typeof " + this.prev.text + " != 'undefined' ")
        this.after(toks)
        this.prev.remove(this)
        return toks
      }
        
      if(this.op == "?") {
        this.op = "!="
        this.text = " != "
        this.after(new Token.word("null"))
        
        var pair = Token.bracket.pair("()")
        this.expressionStart().before(pair.L)
        this.next.after(pair.R)
      } else {
        // we need to do a little more :D
        var op = this.op.slice(1)
        this.op = "!="
        this.text = " != "
        this.comparison = true
        
        var start = this.prev.expressionStart()
        var lhs = start.collectText(this.prev)
        var complex = /\(/.test(lhs)
        
        
        if(complex) {
          lhs = "_xpr"
        }

        var rhs = this.next.remove(this.next.expressionEnd()).collectText()
        var s = "null ? " + lhs + op + rhs + " : null"
        
        var pair = Token.bracket.pair("()")
        start.before(pair.L)        
        this.after(Token.ize(s)).after(pair.R)
        
        if(complex)
          start.cacheExpression()
      }
    }
  })
}
