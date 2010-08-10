require.module('lib/plugins/indented_blocks', function(exports, require) {
//////////////////////


exports.indented_blocks = function(stream, Token) {
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
    block.prev.before(pair.L).before(new Token.whitespace(" "));
        
    if(oneLiner)  { 
      block.nextNewline().before(pair.R).before(new Token.whitespace(" "));
    } else {

      var cur = block.lastNewline()
      var indent = cur.indent()
      while(cur) {
        var cur = cur.next.nextNewline()
        if(!cur || cur.indent().length == 0 || cur.indent().length < indent.length) break
      }
      
      cur = cur || stream.global.matchingBracket.prev

      var len = Math.max(indent.length - 1, 0);
      var space =new Array(len).join(" ");
      (cur.nextNewline()).before(pair.R).before(new Token.whitespace("\n"+space))

    }
    

    return pair.L
  })
}



/////////////////////////
})