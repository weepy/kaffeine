require.module('./plugins/double_brackets', function(module, exports, require) {
// start module: plugins/double_brackets

var Token = require("../token");

exports.double_brackets = function(stream) {
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


// end module: plugins/double_brackets
});
