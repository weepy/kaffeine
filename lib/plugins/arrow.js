var Token = require("../token");

module.exports = function(stream) {
  var insert_bind
  stream.each(function(token) {
    Token.current_token = token
    var fat
    if(token.text == "=>") {
      insert_bind = fat = true
      token.text = "->"
    }

    if(token.text != "->") return

    var args
    if(token.prev.rbracket) {
      var from = token.prev.matching
//    if(from.prev.word) from = from.prev
      args = from.remove(token.prev).collectText()
        
    }
        
    var x = token.myText().replace(/->/, "function" + (args || "()") )
    
    if(args) x = x.replace(/ *function/, "function")
    this.prev.after(x)

  
    var next = this.nextNW()
    var block = next
    
    if(!next.curly) {
      
      var pair = Token.bracket.pair("{}")
      
      if(this.myRightEatenText().match(/\n/)) {
        var brack = this.prev.lbracket ? this.prev : this.prev.prev
        brack.after(pair.L).after(pair.R)
      } else {
        next.before(pair.L)
        var newline = next.find(function(token) { 
          if(token.newline) return true
        })
        newline.before(pair.R).before(" ")
        pair.L.after(" ")
      }
      
      pair.L.updateBlock()
      block = pair.L
    }
    token.remove()
    
    block.updateBlock()

    if(fat) {
      var pair = Token.bracket.pair("()")
      block.blockTypeNode.before(pair.L)
      block.matching.after(pair.R) //.after(";")
      pair.L.before("__bind")
      pair.R.before(", this")
    }
    
    return block
  })

  if(insert_bind) {
    var g = stream.block
    g.matching.before(__bind.toString())
  }
}


function __bind(fn, me){ return function(){ return fn.apply(me, arguments); }; };
