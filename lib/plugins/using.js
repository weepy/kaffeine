var Token = require("../token");

var trim = function(s) { return s.replace(/^ */g,"").replace(/ *$/g,"")}
module.exports = function(stream) {

  stream.each(function(token) {
    Token.current_token = this
    var ret = this.prev
    if(token.text != "using") return
    
//    if(!token.prev.newline) return // && (token.prev.whitespace && !token.prev.prev.newline)) return
    
    var methods = ""
    var from = this.next.find(function() {
      if(this.text == "from") return true
      methods += this.myText()
    })
    
    methods = trim(methods)
    var end = from.find(function() { 
      if(this.newline) return true
    })
    var expr = from.next.collectText(end)
    expr = expr.trim()
    // console.log("Expr" + expr)
    if(methods == "*") {

      var text = "var _i = " + expr + "; for(var _j in _i) eval('var ' + _j + ' = _i[\\'' + _j + '\\'];');"
    } else {
      methods = methods.split(",")
      var text = "var _i = " + expr + ";" 
      for(var i=0;i<methods.length; i++) {
        var m = trim(methods[i])
        text += " var " + m + " = _i[" + m+ "];"
      }
    }
    
    this.before(text + "\n")
    this.remove(end)
    return ret
  })
  
}
