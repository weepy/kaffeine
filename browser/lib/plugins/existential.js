require.module('lib/plugins/existential', function(exports, require) {
//////////////////////


exports.existential = function(stream, Token) {
  stream.each(function() {
    if(this.operator && this.text.match(/^\?/) && !this.prev.whitespace) { // don't want to match ternary
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


// if(x?)
//     (x != null)
// 
// if(x?.x)
//     (x != null ? x.x : null)
//           
//     
// if(x()?.x)
//     ((_xpr = x()) != null ? _xpr.x : null)
//     
// if(x()?[123])
//     ((_xpr = x()) != null ? _xpr[123] : null)
//     
// if(x()?[123])
//     ((_xpr = x()) != null ? _xpr[123] : null)
// 
// if(x()?(123))
//     ((_xpr = x()) != null ? _xpr(123) : null)
//     
// if(x()?.y()?[])
//     ((_xpr = x()) != null ? _xpr.y()?[] : null)
//     ((_x = x()) != null ? ((_x = _x.y()) ? _x[] : null) : null)
//     


/////////////////////////
})