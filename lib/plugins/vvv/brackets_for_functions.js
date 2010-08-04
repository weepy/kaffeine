Kaffeine.plugin("brackets_for_functions", function(stream) {
  var nobrackets_keywords = {"return":1,"var":1,"throw":1}
  
  stream.each(function() {
    var ws = this.next
    if(!ws || !ws.whitespace || !ws.next || ws.newline) return
    if(this.word && nobrackets_keywords[this.text]) return
    
    var nn = ws.next
    var match = (this.word || this.rbracket) && (nn.word || (nn.lbracket && !nn.round) || nn.string)
    
    if(!match) return
    
    var end = nn.find(function(token) {
      if(token.whitespace || token.rbracket) return true
      if(token.matchingBracket && token.lbracket) return token.matchingBracket.next
    })
    
    if(end == null) return
    
    var pair = Bracket.pair("()")
    ws.replaceWith(pair.L)
    if(end.whitespace) end = end.prev
    end.after(pair.R)
  })
})


