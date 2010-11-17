require.module('./plugins/pipe', function(module, exports, require) {
// start module: plugins/pipe

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
  

/*      if(!r.lbracket) {
        var pair = Token.bracket.pair("()")
        r.before(pair.L).after(pair.R)
        r = pair.R
      } else {
        r = r.matchingBracket
      }

	 
      var rhs = r.next.remove(R)
      L.before("__.")
      
      
      
      var cont = r.next
      
      this.after(this.pipe_function + ".call")
      r.prev.after("this, ").after(new Token.word(lhs.collectText())).after(", ").after(rhs)
      r.next.remove()
      this.remove()
      return r
    }
  }) 
}*/

// end module: plugins/pipe
});
