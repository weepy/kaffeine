require.module('./plugins/at', function(module, exports, require) {
// start module: plugins/at

var Token = require("../token");

module.exports = function(stream) {

  stream.each(function() {
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



// end module: plugins/at
});
