var Token = require("../token");
exports.indented_blocks = function(stream) {
  var x
  var block_keywords = "if unless for while else try catch function class".split(" ") 
  // should really expose these 
  
  stream.each(function() {
    if(!this.word || block_keywords.indexOf(this.text) < 0 || this.global) return 
    if(this.block) return
    
    var token = this
    if(token.text == "function" || this.text == "class") {
      token = token.find(function() { 
        if(this.next.newline) return true 
        if(this.next.round && this.text == "function") return true
      }) // we need to skip over any named functions        
    }
   
    var newline = null
    var block = token.next.find(function() {
      if(this.newline) newline = this
      if(this.whitespace) return // ignore
      if(this.round) {
        if(this.lbracket)
          return this.matchingBracket
      }
      else return true
    })
    
    if(block.curly) return // we already have one !
    if(token.text == "else" && block.text == "if") return // 'else if' is allowed!
    //    var oneLiner = !block.prev.newline
    
    var pair = Token.bracket.pair("{}")     // we need to insert some !
    
    if(!newline)  { 
      block.prev.before(pair.L).before(" ");
    } else {
      newline.before(pair.L).before(" ");
    }
        
    if(!newline)  {
       var nl = block.next.find(function(tok) {
        if(tok.lbracket) return tok.matchingBracket.next // skip over
        if(tok.newline || tok.rbracket) return true
      })
      pair.R.eaten.left.push(Token.ize(" "))
      nl.before(pair.R);
    } else {
      var cur = block.prevNewline()
      var indent = cur.indent()
      while(cur) {
        var cur = cur.next.find(function(token) {
          if(token.rbracket) return true
          if(token.lbracket) return token.matchingBracket.next
          if(token.newline) return true
        })
      
        if(!cur || cur.rbracket || cur.indent().length == 0 || cur.indent().length < indent.length) break
      }
      
      if(cur && cur.rbracket) {
        pair.R.eaten.left.push(Token.ize(" "))
        cur.before(pair.R)
      } else {
        cur = cur || stream.global.matchingBracket.prev
        var len = Math.max(indent.length - 1, 0);
        var space =new Array(len).join(" ");
        (cur.nextNewline("include", "skipbrackets")).before(pair.R).before(new Token.whitespace("\n"+space))
      }

    }
    
    pair.L.updateBlock()
    
    return pair.L
  })
}
