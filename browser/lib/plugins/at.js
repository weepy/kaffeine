require.module('plugins/at', function(exports, require) {
// start module 

exports.at = function(stream, Token) {

  stream.each(function() {
    if(this.unknown && this.text == "@") {
      var word = "this"

      if(this.next.text == "@") {
        this.next.remove()  
        word = "this.constructor"
      }

      var token = new Token.word(word)
      this.replaceWith(token)
      if(token.next.word || token.next.lbracket) 
        token.after(new Token.operator("."))
      return token
    }
  })
}



// end module
})