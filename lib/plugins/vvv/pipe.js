Kaffeine.plugin("pipe", function(stream) {

  stream.each(function() {
    if(this.operator && this.op == "|") {
      var L = this.expressionStart()
      var fn = this.next
      var r = fn.next
      if(!r.lbracket) {
        var pair = Bracket.pair("()")
        fn.after(pair.L).after(pair.R)
        r = pair.R
      } else {
        r = r.matchingBracket
      }
            
      var R = r.next.next.find(function() {
        if(this.next.whitespace || this.next.op == "|") return true
      })

      var rhs = r.next.next.remove(R)
      var lhs = L.remove(this.prev)
      
      var cont = r.next

      r.prev.after(new Word(lhs.allText())).after(new Operator(",")).after(rhs)
      r.next.remove()
      this.remove()
      return r
    }
  }) 
})

