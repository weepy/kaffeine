require.module('./plugins/indented_blocks', function(module, exports, require) {
// start module: plugins/indented_blocks

var Token = require("../token");
exports.indented_blocks = function(stream) {
  var x
  var block_keywords = "if for while else try catch function class".split(" ")
  stream.each(function() {
    if(!this.word || block_keywords.indexOf(this.text) < 0 || this.global) return 

    var token = this
    if(token.text == "function" || this.text == "class") {
      token = token.find(function() { if(this.next.round || this.next.newline) return true }) // we need to skip over any named functions        
    }
    
    var block = token.next.find(function() {
      if(this.whitespace) return // ignore
      if(this.round) {
        if(this.lbracket)
          return this.matchingBracket
      }
      else return true
    })
    
    if(block.curly) return // we already have one !
    if(token.text == "else" && block.text == "if") return // 'else if' is allowed!
    var oneLiner = !block.prev.newline
    
    var pair = Token.bracket.pair("{}")     // we need to insert some !
    block.prev.before(pair.L).before(" ");
        
    if(oneLiner)  { 
      block.nextNewline().before(pair.R).before(" ");
    } else {
      var cur = block.prevNewline()
      var indent = cur.indent()
      while(cur) {
        var cur = cur.nextNewline()
        if(!cur || cur.indent().length == 0 || cur.indent().length < indent.length) break
      }
      
      cur = cur || stream.global.matchingBracket.prev

      var len = Math.max(indent.length - 1, 0);
      var space =new Array(len).join(" ");
      (cur.nextNewline("include", "skipbrackets")).before(pair.R).before(new Token.whitespace("\n"+space))

    }
    
    pair.L.updateBlock()
    
    return pair.L
  })
}


// end module: plugins/indented_blocks
});
