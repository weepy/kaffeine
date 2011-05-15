var Token = require("../token");
module.exports = function(stream) {
  stream.each(function() {
    Token.current_token = this
    
    if(!this.blockType || this.blockType != "function" || this.class_name) return
    
    if(this.global) return

    var end = this.matching.prev.findRev(function(tok) {
       return (tok.whitespace || tok.semi) ? null : true
    })
    
    if(end == this || end.text == "return") return  // probably an empty function

    
    // sure this could be a bit neater
    var start = end.findRev(function(tok) {
      if(tok.rbracket) {
        return tok.matching        
      }
      else if(tok.lbracket && tok.curly) {
        var type = tok.blockType
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
      else if(tok.prev.whitespace) {
        var t = tok.prev.prev.text 
        if(t == "new" || t == "typeof" || t=="var") return tok.prev.prev
        else return true
      }
      else if(tok.prev.semi  || tok.prev.lbracket) 
        return true
      else 
        return null
    })
    
    if(!start) return
    if(start.text == "return") return
    
    
    if(start.prev.prev) {
      var t = start.prev.prev.text
      if(t == "throw" || t == "return") return 
    }
    
    start
      .before(new Token.whitespace(" "))
      .before(new Token.word("return"))
    
  })
}
