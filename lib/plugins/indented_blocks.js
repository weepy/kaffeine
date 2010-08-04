exports.indented_blocks = function(stream, Token) {
  var x
  stream.each(function() {
    if(!this.keyword || block_keywords.indexOf(this.text) < 0) return 
    
    x = this.next
    if(x.matchingBracket) x = x.matchingBracket
    if(x.next.whitespace) x = x.next
    if(x.next.lbracket && x.next.curly) return
    
    var pair = Token.bracket.pair("{}")     // we need to insert some !
    x.before(pair.L).before(new Token.whitespace(" "))
    var cur = x, indent = this.nextNewline().indent()
    while(true) {
      cur = cur.next.nextNewline()
      if(!cur || cur.indent() < indent)
        break
    }
    var space = new Array(indent-1).join(" ")
    cur.nextNewline().before(pair.R).before(new Token.whitespace("\n"+space))
    return pair.L
  })
}