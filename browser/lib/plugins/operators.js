require.module('./plugins/operators', function(module, exports, require) {
// start module: plugins/operators

var Token = require("../token");
/*

Number \ = `Math.floor @/#`
Number.prototype['\'] = function(RHS) { Math.floor(this/RHS) }

Number ** = `Math.pow @, #`

.. LHS .. ** .. RHS ..
(.. LHS ..)['**'](.. RHS ..)

*/

exports.operators = function(stream) {
  var operators = {}
  stream.each(function() {
    
    // look for operator ** ++ \\
    var next = this.next
    
    if(this.word && this.text == "operator") {
      var op, klass
      var nl = this.nextNewline()
      var ops = this.next.collectText(nl).trim().split(" ")
      for(var i in ops) operators[ops[i]] = 1
      this.remove(nl.prev)
      return nl
    }
    
    if(this.operator && this.next.assign) {
      this.replaceWith(".prototype['" + esc(this.text) + "'] ")
      operators[this.text] = true
      return next
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



// end module: plugins/operators
});
