exports.implicit_vars = function(stream, Token) {
  var stack = [], closures = [], variable, current, closure
  
  stream.each(function(token) {    
    if(!token.assign) return 
    variable = token.prev.text
    if(!/^[A-Za-z0-9$_]*$/.test(variable)) return
    
    current = closure = this.findClosure()
    var found = false
    
    while(current) {
      if(!current._vars) {
        current._args = findArgs(current)
        current._vars = {}
      }
      if(current._vars[variable] || current._args[variable]) {
        found = true
        break
      }
      current = current.parent
    }
    
    if(!found) closure._vars[variable] = true
    if(closures.indexOf(closure) < 0)
      closures.push(closure)
  })
  
  for(var i=0; i < closures.length; i++) {
    var vars = [], closure = closures[i]
    for(var j in closure._vars) vars.push(j)
    if(!vars.length) return
    
    var string = "var " + vars.join(", ") + ";"
    if(closure.block) {
      var n = closure.lastNewline()
      string = (n ? n.text : "") + "  " + string // should find current indent really
    }
    else
      string = string + "\n"
    closure.after(Token.ize(string))
  }
}

function findArgs(bracket) {
  if(!bracket.prev) return {}
  
  var args = {}
  bracket.prev.findRev(function(tok) {
    if(tok.lbracket) return true
    if(tok.word)
      args[tok.text] = true
  })
  return args
}




