var Token = require("../token");

exports.backticks = function(stream) {
  stream.each(function() {
    if(this.unknown && this.text == '`') {
      
      var max = 0
      var reg = /^[0-9]+$/
      var next = this.next
      
      if(next.operator && next.op != "#")
        next = next.before("#")
        
      var end = next.find(function(tok) {
        if(tok.text == '`') return true
        
        if(tok.text == "#") {
          var next = tok.next
          var n = Number(next.text) || 0
          if(!n) {
            if(max < 1) max = 1
            return tok.replaceWith(new Token.word("_1"))
          } else {
            next.text = "_" + n
            tok.remove()
            if(n > max) max = n
            return next
          }
        }
      })
      
      
      var args = []
      for(var k=0; k<max; k++) args.push("_"+(k+1))
      
      // faster but less neat than just creating the text and calling Token.ize?
      var b1 = Token.bracket.pair("()"), b2 = Token.bracket.pair("()"), b3 = Token.bracket.pair("{}")       
      var head = b1.L
      
      head.after(new Token.word("function"))
          .after(b2.L)
          .after(new Token.word(args.join(",")))
          .after(b2.R)
          .after(b3.L)
          .after(new Token.word("return"))
          .after(new Token.whitespace(" "))
      
      this.replaceWith(head)
      
      end.replaceWith(b3.R)
      b3.R.after(b1.R)

      return b1.R.next
    }
  })
}
