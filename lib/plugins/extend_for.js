exports.extend_for = function(stream, Token) {
  
  stream.each(function() {
    if(this.keyword && this.text == "for") { 
      var text = "",
          brace = this.next,
          skip = false,
          toks = [], var2, var1, loopWord,
          complex
          
      var closingBrace = brace.matchingBracket

      brace.next.find(function() {      
        if(this.next == closingBrace) return true
        if(this.semi) { skip = true; return true }
        if(this.word && (this.text == "in" || this.text == "of") ) loopWord = this
        if(this.round) complex = true
        toks.push(this)
      })
      
      var var1 = toks[0]
      if(toks[1].op == ",") var2 = toks[2]
      if(skip) return closingBrace.next
      
      if(complex) {
        loopWord.next.next.cacheExpression()
      }

      var expressionText = loopWord.next.next.collectText(closingBrace.prev)          
      var iter, val
      
      if(loopWord.text == "in") { 
        if(!var2) return // nothing to do !
        var2.prev.remove(var2) 
        iter = var1.text
        val = var2.text
      } else {
        brace.next.remove(closingBrace.prev)
        if(var2)
          iter = var2.text
        else {
          var closure = this.findClosure()
          iter = closure.getUnusedVar()
          closure.vars[iter] = true
        }
        val = var1.text
        
        var string = iter + " = 0; " + iter + " < " + expressionText + ".length; " + iter + "++"
        brace.after(new Token.word(string))          
        
      }
      
      this.block.after(new Token.word("\n  " + this.indent() + val + " = " + (complex ? "_xpr" : expressionText) + "[" + iter + "];"))
     
      return 
    }
  })
}







/*

function() {
  
  for(i, v in O) {
    for(j, w in P) {
      log(w + v)
    }
  }
  for(i, v in R) {
    log(v)
  }

  var i, v, j, w
  for(i in O) {
    v = O[i]
    for(j, w in P) {
      w = P[j]
      log(w + v)
    }
  }
  for(i in R) {
    v = R[i]
    log(v)
  }

  for a of A()
    log a

  var a, _f, _fcache = A()
  for(_f=0; _f<_fc; _f++) {
    a = _fc[_f]
  }

  for a, i of A()
    log a

  var a, i, _fc = A()
  for(i=0; i<_fc; i++) {
    a = _fc[i]
  }


  bracket.fn.getTempVar = function(prefix) {
    return this._vars[prefix] = (this._vars[prefix] || 0) + 1
  }

  bracket.fn.returnTempVar = function(name) {
    var num = name.slice(name.length - 2) / 1
    var prefix = name.slice(0,name.length - 2)
    if(this._vars[prefix] != num) throw "error: expecting not expecting var " + name
    this._vars[prefix] --
  }
}
*/