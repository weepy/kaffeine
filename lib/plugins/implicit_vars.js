var Token = require("../token");
module.exports = function(stream) {
  var stack = [], variable, current, closure
 
  
  // remove vars
  stream.each(function(token) {  
    Token.current_token = this
    
    var ret = token.prev
    if(token.text != "var") return
    if(token.next.space)
      token.next.remove()
    token.remove()
    return ret
  })

  stream.each(function(token) {  
    Token.current_token = this
      
    if(!token.assign) return 
    variable = token.prev.text
    
    if(!/^[A-Za-z0-9$_]*$/.test(variable)) return
    if(token.prev.prev.operator && token.prev.prev.text != ",") return
    if(token.prev.prev.prev.text == "var") return
    current = closure = this.findClosure()
    var found = false
    
    while(current) {
      if(current.vars[variable] || (current.args && current.args[variable])) {
        found = true
        break
      }
      current = current.parent
    }
    
    if(!found) {
      // console.log("current", variable)
      closure.vars[variable] = true
    }
  })

}
