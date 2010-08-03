Kaffeine.plugin("@", function(stream) {
  stream.each(function() {
    if(this.unknown && this.text == "@") {
      var word = "this"
      
      if(this.next.text == "@") {
        this.next.remove()  
        word = "this.constructor"
      }
      
      var token = new Word(word)
      this.replaceWith(token)
      if(token.next.word || token.next.lbracket) token.after(new Operator("."))
      return token
    }
  })
})

