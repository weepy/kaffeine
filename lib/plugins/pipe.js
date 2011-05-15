var Token = require("../token");
module.exports = function(stream) {

  stream.each(function() {
    Token.current_token = this
    
    if(this.text != "|") return
    var pipe = this
	  var L = this.expressionStart()
    var lhs = L.remove(pipe.prev) 
    
    var R = pipe.next.expressionEnd(function() {
     return this.text == "|"
    })

    
    var rhs = pipe.next.remove(R) //.collectText()
    var ret = pipe.prev
    pair = Token.bracket.pair("()")
    
    var t = pipe.myText().replace("|", "__").replace(/ /g, "")

    tokens = Token.ize(t + "." + pipe.pipe_function + ".call")
    tokens.append(pair.L)
    tokens.append("this, ")
    tokens.append(lhs)

    if(rhs.text == "(") {
      var t = rhs.collectText()
      t = t.slice(1, t.length-1)
      rhs = Token.ize(t || " ")
    }

    if(rhs.collectText().match(/^[ \n]*$/) ) {
      // empty or empty brackets!
    } else {
      tokens.append(", ")
      tokens.append(rhs)
    }
    tokens.append(pair.R)
    
    pipe.replaceWith(tokens) //"__." + pipe.pipe_function + ".call(this, " + lhs + ", " + rhs + ")")
    
    return ret
  })

}

