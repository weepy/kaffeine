var Token = require("../token");

module.exports = function(stream) {

  stream.each(function() {
    Token.current_token = this
    
    if(this.text == "#") {

      if(this.prev.word && !this.myText().match(/^ /)) return // no whitepsace next to a word
      
      
      if(this.next.word) {
        if(this.myText().match(/ $/) || !this.next.text.match(/^[0-9]+$/)) {
          return
        }
//        console.log("X", this.next.text)
//        if() return // no whitepsace next to a word
      }
      var word = "arguments"
      
      if(!this.next.word)
        word += "[0]"
      else {
        word += "[" + this.next.remove().collectText() + "]"
      }
      ret = this.next
      this.replaceWith(word)
      return ret
    }
  })
}

