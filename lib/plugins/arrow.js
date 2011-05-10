var Token = require("../token");

module.exports = function(stream) {
  var insert_bind
  stream.each(function(token) {

    var fat
    if(token.text == "=>") {
      insert_bind = fat = true
      token.text = "->"
    }

    if(token.text != "->") return

    var args = "()"
    if(token.prev.rbracket) {
      var from = token.prev.matching
//    if(from.prev.word) from = from.prev
      args = from.remove(token.prev).collectText()
    }

    var x = token.text.replace(/->/, "function" + args + " " )
    this.prev.after(x)

    var next = this.nextNW()
    var block = next
    if(next.curly) 
      next.updateBlock()
    else {
      var pair = Token.bracket.pair("{}")
      next.before(pair.L)
      var newline = next.find(function(token) { 
        if(token.newline) return true
      })
      newline.before(pair.R).before(" ")
      pair.L.after(" ")
      pair.L.updateBlock()
      block = pair.L
    }

    if(fat) {
      var pair = Token.bracket.pair("()")
      var func = this.prev.findRev(function() { if(this.text == "function") return true }) 
      func.before(pair.L)
      block.matching.after(pair.R).after(";")
      pair.L.before("__bind")
      pair.R.before(", this")
    }
    
    this.remove()
  })

  if(insert_bind) {
    var g = stream.block
    g.matching.before(__bind.toString()+ ";")
  }
}


function __bind(fn, me){ return function(){ return fn.apply(me, arguments); }; };
