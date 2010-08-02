Kaffeine.plugin("arrow", function(stream) {
  stream.each(function(token) {
    if(!token.operator || token.op != "->") return
    
    var args = "()"
    if(token.prev.rbracket) {
      var from = token.prev.matchingBracket
      if(from.prev.word) from = from.prev
      args = from.remove(token.prev).allText()
    }
    
    var text = token.text.replace("->", "function" + args)
    var toks = Token.ize(text)
    this.prev.after(toks)
    
    var newCurly = this.find(function(token) {
      if(token.curly) {
        token.updateBlock()
        return false
      }
      return true
    })
    
    if(newCurly) {
      var pair = Bracket.pair("{}")
      newCurly.before(pair.L)
      var newline = newCurly.find(function(token) { if(token.newline) return true })
      newline.before(pair.R)
      pair.L.updateBlock()
    }
    
    this.remove()
    
    return toks
  })
})
