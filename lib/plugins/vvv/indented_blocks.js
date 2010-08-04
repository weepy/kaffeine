Kaffeine.plugin("indented_blocks", function(stream) {
  var x
  stream.each(function() {
    if(!this.keyword || block_keywords.indexOf(this.text) < 0) return 
    
    x = this.next
    if(x.matchingBracket) x = x.matchingBracket
    if(x.next.whitespace) x = x.next
    if(x.next.lbracket && x.next.curly) return
    
    var pair = Bracket.pair("{}")     // we need to insert some !
    x.before(pair.L).before(new Whitespace(" "))
    var cur = x, indent = this.nextNewline().indent()
    while(true) {
      cur = cur.next.nextNewline()
      if(!cur || cur.indent() < indent)
        break
    }
    var space = new Array(indent-1).join(" ")
    cur.nextNewline().before(pair.R).before(new Whitespace("\n"+space))
    return pair.L
  })
})


