var Token = require("../token")

module.exports = function(stream) {
  var mapping = { "is": "===", "isnt": "!==", "or": "||", "and": "&&", "not": "!" }, op, token

  stream.each(function() {
    Token.current_token = this
    
    var op = mapping[this.text]
    
    if(!op) return
    if(this.prev && this.prev.operator && this.text != "not") return
    if(this.next && this.next.operator && this.next.text != "!") return

    var token = this.replaceWith(op)
    if(token.text == "!" && token.next.whitespace)
      token.next.remove()
    
    token.eat(function() { return this.whitespace })
    token.eat(function() { return this.whitespace })
      
    return token // skip to this token in the stream
  })


}
