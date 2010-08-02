Kaffeine.plugin("implicit_return", function(stream) {
  stream.each(function() {
    if(!this.block || this.block != "function") return
    
    var end = this.matchingBracket.prev.findRev(function(tok) {
       return (tok.whitespace || tok.semi) ? null : true
    })
    
    
    // sure this could be a bit neater
    var start = end.findRev(function(tok) {
      if(tok.rbracket) {
        return tok.matchingBracket        
      }
      else if(tok.lbracket) {
        var type = tok.block
        if(type == "function") {
          return tok.prev.findRev(function(t) { 
              if(t.text == "function") return true 
             })
        }
        else if(type == "object") {
          if(tok.prev.whitespace || tok.prev.semi || tok.prev.lbracket) 
            return true
        }
        else return false          
      }
      else if(tok.prev.whitespace || tok.prev.semi  || tok.prev.lbracket) 
        return true
      else 
        return null
    })
    
    if(!start) return
    
    if(start.prev.prev && start.prev.prev.text == "return") return
    
    start
      .before(new Whitespace(" "))
      .before(new Word("return"))
  })
})
