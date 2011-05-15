var Token = require("../token");
module.exports = function(stream) {
  stream.each(function(token) {
    Token.current_token = this
    
    if(!token.operator) return
    
    if(token.text == "||=")
      var op = "|| "
    else if(token.text == ".=")
      var op = "."
    else return
    
    optoken = token.after(op)  
    token.text = "="

    var lhs = "" 
    token.prev.findRev(function(token) {
      if(token.whitespace || token.unknown) return true
      lhs = token.text + lhs
    })

    var tokens = Token.ize(lhs)    
    if(op != "." ) tokens.tail().eaten.right.push(Token.ize(" "))
    token.after(tokens, tokens.tail())
    
  })
  
  // extend
  var inserted_merge = false
  stream.each(function(token) {
    Token.current_token = this
    
    if(token.text != "<-" ) return 
    var arrow = this
    var L = this.expressionStart()
    var lhs = L.remove(arrow.prev).collectText()

    var R = arrow.next.expressionEnd(function() {})

    var rhs = arrow.next.remove(R).collectText()
    var ret = arrow.prev

    // if(token.text == "=>") {
    //   arrow.replaceWith("__merge(" + lhs + ", " + rhs + ")")
      
    //   if(inserted_merge) {
    //     var g = stream.block
    //     if(!g.global) throw "WTF!"
    //     g.matching.before(new Token.word(__merge))
    //     inserted_merge = true
    //   }

    // }
    // else {
    xxx = arrow.prev
    arrow.replaceWith("__merge(" + lhs + ", " + rhs + ")")

    if(!inserted_merge) {
      var g = stream.block
      if(!g.global) throw "WTF!"
      g.matching.before(new Token.word(__merge))
      inserted_merge = true
    }

    //token.global.vars['__extend'] = __extend.toString()
    return ret
  })
}

// var __extend = "\nfunction __extend(a,b) {\n\
//   var c = {}, i;\n\
//   a = a || {};\n\
//   for(i in a) c[i] = a[i];\n\
//   for(i in b) c[i] = b[i];\n\
//   return c;\n\
// }"

var __merge = "\nfunction __merge(a,b) {\n\
  b = b || {};\n\
  for(var k in b) a[k] = b[k];\n\
  return a;\n\
}"

