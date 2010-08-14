require.module('./plugins/missing_commas', function(exports, require) {
// start module 

exports.missing_commas = function(stream, Token) {

  stream.each(function() {
    if(!this.lbracket || !(this.curly || this.square)) return
    if(this.curly && this.blockType != "object") return
    var L = this, R = this.matchingBracket
    var end = L.next.find(function() {
      if(this == R) return true
      if(this.lbracket) return this.matchingBracket.next // skip over
      if(this.newline && !this.operator && this.next != R && this.prev != L) {
        this.before(",")
      }
    })
  })
}


// end module
})