require.module('plugins/implicit_vars', function(exports, require) {
// start module 

exports.implicit_vars = function(stream, Token) {
  var stack = [], variable, current, closure
  
  stream.each(function(token) {    
    if(!token.assign) return 
    variable = token.prev.text
    if(!/^[A-Za-z0-9$_]*$/.test(variable)) return
    
    current = closure = this.findClosure()
    var found = false
    
    while(current) {
      if(current.vars[variable] || current.args[variable]) {
        found = true
        break
      }
      current = current.parent
    }
    
    if(!found) closure.vars[variable] = true
  })
  

}







// end module
})