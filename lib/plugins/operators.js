var Token = require("../token");
/*

operator Number \ = function(RHS) { Math.floor(this/RHS) }
Number.prototype['\'] = function(RHS) { Math.floor(this/RHS) }

operator **
// gone

.. LHS .. ** .. RHS ..
(.. LHS ..)['**'](.. RHS ..)

Number.prototype["**"] = function(x) { return Math.pow(this, x)}

*/

exports.operators = function(stream) {
  var operators = {}
  stream.each(function() {
    
    if(this.word && this.text == "operator") {
      var op, klass,
          ret = this.prev
            
      if(this.next.operator) {
        op = this.next        
      } else {
        klass = this.next.next
        op = klass.next
      }
      
      operators[op.op] = true
  
      if(klass)
        op.after(klass.text + ".prototype['" + esc(op.op) + "'] ")
      
      this.remove(op)
      return ret
    }
    
    if(this.operator && operators[this.op]) {
      var L = this.expressionStart(function() { return this.operator })
      var R = this.expressionEnd(function() { return this.operator })
      var p1 = Token.bracket.pair("()"), p2 = Token.bracket.pair("()")
      L.before(p1.L)
      R.after(p2.R)
      this.before(p1.R)
      this.after(p2.L)
      this.replaceWith("['" + esc(this.op) + "']")
      
      var prev = p1.L.prev
      if(prev.whitespace) prev = prev.prev
      // insert semi's where necessary
      if(!prev.operator && !prev.lbracket && !prev.semi )   
        prev.after(";")

      return p2.L
    }
    
  })
  
}

function esc(op) {
  return op.replace("\\","\\\\")
}

