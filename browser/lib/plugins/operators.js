require.module('./plugins/operators', function(module, exports, require) {
// start module: plugins/operators

var Token = require("../token");
module.exports = function(stream) {
  stream.each(function(token) {
    if(!token.operator) return
    
    if(token.text == "||=")
      var op = "|| "
    else if(token.text == ".=")
      var op = "."
    else return
    
    token.after(op)  
    token.text = "="

    var lhs = "" 
    token.prev.findRev(function(token) {
      if(token.whitespace || token.unknown) return true
      lhs = token.text + lhs
    })

    if(op != "." ) lhs += " "

    var tokens = Token.ize(lhs)
    token.after(tokens, tokens.tail())
    
  })
}


// end module: plugins/operators
});
