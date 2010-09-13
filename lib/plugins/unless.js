var Token = require("../token");
exports.unless = function(stream) {
  stream.each(function() {
    if(this.word && this.text == "unless") {
      
      var pair = Token.bracket.pair("()")
      
      var end = this.find(function(token) {
        if(token.lbracket && token.curly) return true
        if(token.newline) return true
      })
      
      if(end.operator)
        end = end.spitRight()
      
      var n = this.next, op = new Token.operator("!")
      n.after(pair.L)
      n.after(op)
      if(end.prev.whitespace) end = end.prev
      end.before(pair.R)

      this.text = "if"
      this.keyword = true
    }
  })

}
