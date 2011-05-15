var Token = require("../token");

module.exports = function(stream) {
  stream.each(function() {
    Token.current_token = this
    
    if(this.lbracket && this.round && this.next.lbracket && this.next.round) {
      var n = this.matching.prev
      if(n.rbracket && n.round) {
        this.next.remove()
        n.remove()
      }
    }
  })
}
