var Token = require("../token");

module.exports = function(stream) {

  stream.each(function() {
    Token.current_token = this
    
    if(this.unknown && this.text == "@") {
      var word = "this"

      if(this.next.text == "@") {
        this.next.remove()  
        word = "this.constructor"
      }

      var token = new Token.word(word)
      token.was_at_symbol = true
      this.replaceWith(token)
      if(token.next.word && !token.next.lbracket) 
        token.after(new Token.operator("."))
      return token
    }
  })
}

