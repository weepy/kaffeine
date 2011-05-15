var Token = require("../token");

module.exports = function(stream) {
  var nobrackets_keywords = {"for":1, "if":1, "while": 1, "new":1,"return":1,"var":1,"throw":1, "in":1,"of":1, "typeof":1, "instanceof":1, "else": 1, "try":1, "catch": 1, "class": 1}
    
  stream.tail().each(function() {
    Token.current_token = this
    

    var ws = this.next
    if(!ws || !ws.space || !ws.next) return
    if(this.text == "") return
    if(this.word && ((nobrackets_keywords[this.text] && this.prev.text != ".") || this.block)) return
    if(nobrackets_keywords[ws.next.text]) return
    if(this.matching) {
      var prev = this.matching.prevNW()
      if(["for", "if", "while", "else", "catch"].indexOf(prev.text) >= 0)
        return
    } 
    
    var nn = ws.next
    var match = (this.word || this.rbracket) && (nn.word || nn.lbracket || nn.string) && (nn.blockType != "function")  
    
    if(!match) return
    
    
    var end = nn.expressionEnd(function() {
	    if(this.text == "," && this.next.next.text == ":") return true
	  }) 

    if(end == null) return
    
    var pair = Token.bracket.pair("()")

    ws.replaceWith(pair.L)
    if(end.whitespace) end = end.prev
    end.after(pair.R)
  }, "prev")

}