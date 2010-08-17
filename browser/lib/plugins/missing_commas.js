require.module('./plugins/missing_commas', function(module, exports, require) {
// start module: plugins/missing_commas

var Token = require("../token");
// missing commas for objects is handled by indented_objects

exports.missing_commas = function(stream) {

  stream.each(function() {
    if(!this.lbracket || !this.square) return
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


// end module: plugins/missing_commas
});
