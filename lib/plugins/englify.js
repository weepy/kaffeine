var Token = require("../token")

module.exports = function(stream) {
  var mapping = { "is": "===", "isnt": "!==", "or": "||", "and": "&&", "not": "!" }, op, token

  stream.each(function() {
    var op = mapping[this.text]
    
    if(!op) return
    if(this.prev && this.prev.operator) return
    if(this.next && this.next.operator && this.next.text != "!") return

    var token = this.replaceWith(op)
    if(token.text == "!" && token.next.whitespace)
      token.next.remove()
    
    this.eat(function() { return this.whitespace })
    this.eat(function() { return this.whitespace })
      
    return token // skip to this token in the stream
  })
}
