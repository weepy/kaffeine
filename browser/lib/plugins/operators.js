require.module('./plugins/operators', function(exports, require) {
// start module 

/*

operator Number \ = function(RHS) { Math.floor(this/RHS) }
Number.prototype['\'] = function(RHS) { Math.floor(this/RHS) }

operator **
// gone

.. LHS .. ** .. RHS ..
(.. LHS ..)['**'](.. RHS ..)

Number.prototype["**"] = function(x) { return Math.pow(this, x)}

*/

exports.operators = function(stream, Token) {
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


 
// operator << {
//   LHS.push(RHS)
// }
// 
// a["b"] << get(A)
// to 
// a["b"].push(get(A)) 
// exports.operators = function(stream, Token) {
//   var operators = {}
//   
//   stream.each(function() {
//     if(this.word && this.text == "operator") {
//       var op = this.next
//       var lbracket = op.next
//       
//       var rbracket = lbracket.next.find(function(tok) {      
//         if(tok.matchingBracket == lbracket) return true        
//       })
//       
//       var ret = rbracket.next      
//       this.remove(rbracket)
// 
//       rbracket.remove()
// 
//       var string = lbracket.next.collectText()
// 
//       operators[op.op] = " "+trim(string)+" "
//       return ret    
//     }
//     
//     // find operator
//     if(this.operator && operators[this.op]) {
//       var L = this.expressionStart()
//       var R = this.expressionEnd()
//       var cont = R.next
//       
//       var rhs = this.next.remove(R)
//       var lhs = L.remove(this.prev)
//       
//       var tokens = Token.ize(operators[this.op])
//       tokens.each(function() {
//         var ret
//         if(this.text == "LHS") {
//           ret = lhs.tail()
//           this.replaceWith(lhs) //should really be a clone?!
//           return ret
//         }
//         else if(this.text == "RHS") { 
//           ret = rhs.tail()
//           this.replaceWith(rhs) //should really be a clone?!
//           return ret
//         }
//       })
//       
//       this.replaceWith(tokens)
//       return tokens
//     }
//     // maybe faster to tokenize once and then do some kind of clone
//      
//   })
//       
// }
// 
// function trim(s) {
//   return s.replace(/^\s*/,"").replace(/\s*$/,"")
// }


// end module
})