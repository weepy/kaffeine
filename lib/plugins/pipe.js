require.module('./plugins/pipe', function(module, exports, require) {
// start module: plugins/pipe

var Token = require("../token");
module.exports = function(stream) {

  stream.each(function() {
    if(this.text != "|") return
    var pipe = this
	  var L = this.expressionStart()
    var lhs = L.remove(pipe.prev) //.collectText()

    var R = pipe.next.expressionEnd(function() {
     return this.text == "|"
    })

    var rhs = pipe.next.remove(R) //.collectText()
    var ret = pipe.prev
    
    pair = Token.bracket.pair("()")
    
    tokens = Token.ize("__." + pipe.pipe_function + ".call")
    tokens.append(pair.L)
    tokens.append("this, ")
    tokens.append(lhs)
    tokens.append(", ")
    tokens.append(rhs)
    tokens.append(pair.R)
    
    pipe.replaceWith(tokens) //"__." + pipe.pipe_function + ".call(this, " + lhs + ", " + rhs + ")")
    return ret
  })

}



// end module: plugins/pipe
});
