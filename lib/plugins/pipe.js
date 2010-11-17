var Token = require("../token");
module.exports = function(stream) {

  stream.each(function() {
    if(this.text != "|") return
    var pipe = this
	 var L = this.expressionStart()
     var lhs = L.remove(pipe.prev).collectText()

     var R = pipe.next.expressionEnd(function() {
       return this.text == "|"
     })

     var rhs = pipe.next.remove(R).collectText()
     var ret = pipe.prev
     pipe.replaceWith("__." + pipe.pipe_function + ".call(this, " + lhs + ", " + rhs + ")")
     return ret
  })

}