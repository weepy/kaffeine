var Token = require("../token");

exports.async = function(stream) {
  stream.each(function(token) {
    
    if(token.text != "!") return
    if(token.next.text != "(") return
    if(!token.prev.word) return
    
    if(token.expressionLeft())
    
    var text = "function"
    if(token.next.text != "(")
      text += "()"

    var curly = this.find(function() {
      if(this.curly && this.lbracket) return true
    })
    
    this.replaceWith(text)
    
    curly.updateBlock()
    return curly
  })
}
