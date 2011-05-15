var Token = require("../token");

module.exports = function(stream) {
  stream.each(function(token) {
    Token.current_token = this
    
    if(token.blockType != "object") return
    if(token.next == token.matching) return // empty object    
    if(token.nextNW().next.text == ":") return // must be an object
          
    var pair =  Token.bracket.pair("()")

    token.before(pair.L)
    token.before("function() ")

    token.matching.after(".call(this)")
    token.matching.after(pair.R)

    token.block_scope = token.implicit_function = true
    token.updateBlock()
  })
}
