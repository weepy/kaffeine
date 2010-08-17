var Token = require("../token");
exports.extend_for = function(stream) {
  
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
          iter = closure.getUnusedVar()
        }
        var closure = this.findClosure()
        val = var1.text
        closure.vars[iter] = true
        closure.vars[val] = true
        
        var string = iter + " = 0; " + iter + " < " + expressionText + ".length; " + iter + "++"
        brace.after(new Token.word(string))          
        
      }
      
      this.block.after(new Token.word("\n  " + this.indent() + val + " = " + (complex ? "_xpr" : expressionText) + "[" + iter + "];"))
     
      return 
    }
  })
}





