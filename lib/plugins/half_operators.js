exports.half_operators = function(stream, Token) {
  stream.each(function(token) {
    if(!token.assign || !token.next.operator) return
    var lhs = "" 
    token.prev.findRev(function(token) {
      if(token.whitespace || token.unknown) return true
      lhs = token.text + lhs
    })
    if(token.next.op != "." ) lhs += " "
    var tokens = Token.ize(lhs)
    token.after(tokens, tokens.tail())
  })
}

