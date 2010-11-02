var Token = require("../token");
exports.reverse_blocks = function(stream) {
  var keywords = {"if":1,"for":1, "while":1}
  stream.each(function() {
    if(this.keyword && keywords[this.text] && !this.prevNW().followingWhitespaceWithNewline() ) { 
      var newline = this.prevNewline() //findRev(function() { if(this.newline ) return true })
      var end = this.prev
      var expr = newline.next.remove(end)      
      this.next.matchingBracket.after(" ").after(expr)
      return 
    }
  })
}