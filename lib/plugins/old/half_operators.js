var Token = require("../token");
exports.half_operators = function(stream) {
  stream.each(function(token) {
    if(!token.assign || !token.next.operator) return
    if(token.next.text == "-" || token.next.text == "+") return // let's ignore these since you can just use or +=, -= and it causes ambiguity
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

