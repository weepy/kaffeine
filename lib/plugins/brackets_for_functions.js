var Token = require("../token");

exports.brackets_for_functions = function(stream) {
  var nobrackets_keywords = {"return":1,"var":1,"throw":1, "in":1,"of":1, "typeof":1, "for":1, "instanceof":1, "if":1, "else": 1, "try":1, "catch": 1}
  
  stream.tail().each(function() {
    var ws = this.next
    if(!ws || !ws.whitespace || !ws.next || ws.newline) return
    if(this.word && (nobrackets_keywords[this.text] || this.block)) return
    if(nobrackets_keywords[ws.next.text]) return
    if(this.matchingBracket && this.matchingBracket.prev.block) return
    var nn = ws.next
    var match = (this.word || this.rbracket) && (nn.word || (nn.lbracket && !nn.round) || nn.string) && (nn.blockType != "function")
    
    if(!match) return
    
    var end = nn.find(function(token) {
      if(token.whitespace || token.rbracket) return true
      if(token.matchingBracket && token.lbracket) return token.matchingBracket.next
    })
    
    if(end == null) return
    
    var pair = Token.bracket.pair("()")
    ws.replaceWith(pair.L)
    if(end.whitespace) end = end.prev
    end.after(pair.R)
  }, "prev")
}