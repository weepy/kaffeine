require.module('lib/plugins/operators', function(exports, require) {
//////////////////////


/*
operator << {
  LHS.push(RHS)
}

a["b"] << get(A)
to 
a["b"].push(get(A))
*/

exports.operators = function(stream, Token) {
  var operators = {}
  
  stream.each(function() {
    if(this.word && this.text == "operator") {
      var op = this.next
      var lbracket = op.next
      
      var rbracket = lbracket.next.find(function(tok) {      
        if(tok.matchingBracket == lbracket) return true        
      })
      
      var ret = rbracket.next      
      this.remove(rbracket)

      rbracket.remove()

      var string = lbracket.next.collectText()

      operators[op.op] = " "+trim(string)+" "
      return ret    
    }
    
    // find operator
    if(this.operator && operators[this.op]) {
      var L = this.expressionStart()
      var R = this.expressionEnd()
      var cont = R.next
      
      var rhs = this.next.remove(R)
      var lhs = L.remove(this.prev)
      
      var tokens = Token.ize(operators[this.op])
      tokens.each(function() {
        var ret
        if(this.text == "LHS") {
          ret = lhs.tail()
          this.replaceWith(lhs) //should really be a clone?!
          return ret
        }
        else if(this.text == "RHS") { 
          ret = rhs.tail()
          this.replaceWith(rhs) //should really be a clone?!
          return ret
        }
      })
      
      this.replaceWith(tokens)
      return tokens
    }
    // maybe faster to tokenize once and then do some kind of clone
     
  })
      
}

function trim(s) {
  return s.replace(/^\s*/,"").replace(/\s*$/,"")
}



/////////////////////////
})