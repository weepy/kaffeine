require.module('lib/plugins/englify', function(exports, require) {
//////////////////////


exports.englify = function(stream, Token) {
  var mapping = { "is": "===", "isnt": "!==", "or": "||", "and": "&&", "not": "!" }, op, token
  stream.each(function() {
    if(this.word && (op = mapping[this.text])) {
      token = new Token.operator(op)
      this.replaceWith(token)
      if(token.text == "!" && token.next.whitespace)
        token.next.remove()
      token.hungry()
      return token // skip to this token in the stream
    }
  })
}


/////////////////////////
})