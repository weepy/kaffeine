var Token = require("../token");

exports['class'] = function(stream) {

  stream.each(function() {
    if(!this.word || this.text != "class") return
      
    
    var xtends, superClass, klass
    var start = this.next.next
    if(start.word)
      klass = start.text
    else if(!start.lbracket)
      throw "unknown class name"    

    var hasArgs = false    
    var end = start.find(function() { 
      if(this.lbracket && this.round) hasArgs = true
      if(this.word && this.text == "extends") {
        superClass = this.next.next
        var next = superClass.next.whitespace ? superClass.next.next  : superClass.next
        this.remove(next.prev)
        return next
      }
      if(this.curly || this.newline) return true
    })
    
        
    if(!hasArgs) {
      if(klass)
        start.after(Token.ize("()"))
      else
        start.before(Token.ize("()"))
    }
    
    
    if(superClass)
      this.superClass = superClass.text
    this.text = "function"
    this.keyword = true
    this.klass = klass || "undefined"
    
    // if there's braces following - update to 'function' block
    if(end.curly && end.lbracket)  end.updateBlock()
    else if(end.next.curly && end.next.lbracket) end.next.updateBlock()
  })
}

