var Token = require("../token");
module.exports = function(stream) {
  var assigned = false
  var referenced = false

  stream.each(function() {
    Token.current_token = this
    
    if(this.text == "|" || this.text == "|.") {
      referenced = true

      var L = this.expressionStart()
      
      if(this.text=="|." || this.next.assign) {
        this.text = "__" + this.text.slice(1)
        delete this.operator 
        this.word = true

        if(!assigned && this.next.assign) assigned = true 
        return 
      }
      
      if(this.text != "|")
        throw("unknown pipe operation")
      
      //var fn = this.next
      this.pipe_function = this.next.text

	    this.next.remove()
	    if(this.next.whitespace) this.next.remove()
      if(this.next.text == "|" || this.next.rbracket) this.after("()")
	    return this.next
    }
  })
  if(!assigned && referenced) stream.global.vars["__"] = "require('pipe_utils')" 

}
