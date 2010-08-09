exports.double_brackets = function(stream, Token) {
  stream.each(function() {
    if(this.lbracket && this.round && this.next.lbracket && this.next.round) {
      var n = this.matchingBracket.prev
      if(n.rbracket && n.round) {
        this.next.remove()
        n.remove()
      }
    }
  })
}
