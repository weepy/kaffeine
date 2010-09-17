require.module('./plugins/indented_blocks', function(module, exports, require) {
// start module: plugins/indented_blocks

var Token = require("../token");
exports.indented_blocks = function(stream) {
  var x
  var block_keywords = "if unless for while else try catch function class".split(" ") 
  // should really expose these 
  
  stream.each(function() {
    if(!this.word || block_keywords.indexOf(this.text) < 0 || this.global) return 
    if(this.block) return
    
    var token = this
    var type = token.text
    var state = {
      bracket: false,
      name: false,
      newline: false
    }
    
    var block = token.next.find(function() {
      if(this.newline) {
        state.newline = this
        return true
      }
      if(this.whitespace) return // ignore
      
      if(this.lbracket) {
        if(this.round && !state.bracket) {
          state.bracket = this
          return this.matchingBracket.next
        }
        return true          
      } else if(this.word && !state.name && !state.bracket && type == "function"){
        state.name == this
      } else 
        return true
      
    })
    
    // var token = this
    // // if(token.text == "function") {
    // //   // we need to skip over any named functions
    // //   // token = token.find(function() { 
    // //   //         if(this.next.newline) return true 
    // //   //         if(this.next.round && this.text == "function") return true
    // //   //       })
    // //   token = token.argsList.matchingBracket.next
    // // }
    // 
    // if(token.bracketExpression)
    //   token = token.bracketExpression.matchingBracket.next
    //    
    // var newline = null
    // var block = token.next.find(function() {
    //   if(this.newline) newline = this
    //   if(this.whitespace) return // ignore
    //   if(this.round) {
    //     if(this.lbracket)
    //       return this.matchingBracket
    //   }
    //   else return true
    // })
    
    if(block.curly) return // we already have one !
    if(token.text == "else" && block.text == "if") return // 'else if' is allowed!
    //    var oneLiner = !block.prev.newline
    
    var pair = Token.bracket.pair("{}")     // we need to insert some !
    
    if(!state.newline)  { 
      block.prev.before(pair.L).before(" ");
    } else {
      state.newline.before(pair.L).before(" ");
    }
        
    if(!state.newline)  {
       var nl = block.next.find(function(tok) {
        if(tok.lbracket) return tok.matchingBracket.next // skip over
        if(tok.newline || tok.rbracket) return true
      })
      pair.R.eaten.left.push(Token.ize(" "))
      nl.before(pair.R);
    } else {
      var cur = block
      var indent = cur.prevNewline().indent()
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
        var len = Math.max(indent.length, 0);
        var space = new Array(len+1).join(" ");
        (cur.nextNewline("include", "skipbrackets")).before(pair.R).before(new Token.whitespace("\n"+space))
      }

    }
    
    pair.L.updateBlock()
    
    return pair.L
  })
}


// end module: plugins/indented_blocks
});
