Kaffeine.plugin("backticks", function(stream) {
  stream.each(function() {
    if(this.unknown && this.text == '`') {
      
      var max = 0
      var reg = /^[0-9]+$/
      var end = this.next.find(function(tok) {
        if(tok.text == '`') return true
        
        if(tok.text == "#") {
          var next = tok.next
          var n = Number(next.text) || 0
          if(!n) {
            if(max < 1) max = 1
            return tok.replaceWith(new Word("_1"))
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
      var b1 = Bracket.pair("()"), b2 = Bracket.pair("()"), b3 = Bracket.pair("{}")       
      var head = b1.L
      
      head.after(new Word("function"))
          .after(b2.L)
          .after(new Word(args.join(",")))
          .after(b2.R)
          .after(b3.L)
          .after(new Word("return"))
          .after(new Whitespace(" "))
      
      this.replaceWith(head)
      
      end.replaceWith(b3.R)
      b3.R.after(b1.R)

      return b1.R.next
    }
  })
})

