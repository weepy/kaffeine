require.module('./plugins/slices', function(exports, require) {
// start module 

// A[a..b]
// A.slice(a, b)

exports.slices = function(stream, Token) {
  
  stream.each(function() {
    if(!this.lbracket || !this.square) return 
    var prev = this.prev
    if(this.text != "[" || prev.whitespace || prev.operator) return // needs to be immediately preceded by a word
    var L = this, R = this.matchingBracket
    var ret = R.next
    this.find(function() {
      if(this == R || this.newline) return false
      if(this.op == ".." || this.op == "...") {
        var left, right, minus
        if(L.next != this)
          left = L.next.collectText(this.prev)
        if(R.prev != this)
          right = this.next.collectText(R.prev) 

        minus = (this.op == "..." && right) ? " - 1" : ""
        left = left || "0"        
        
        var expr = prev.expressionStart()
        
        var xText = expr.collectText(L.prev)
        if(!right && xText.match(/\(/)) { // i.e. complex expr
          xText = "_sl"
          L.before(" ")
          expr.cacheExpression("_sl")
          L.prev.remove()
          prev = L.prev
        }
        right = right || xText + ".length"

        L.remove(R)
        var text = ".slice(" + left + ", " + right + minus +")"
        prev.after(text)
      }
    })
    return ret
  })
}

// end module
})