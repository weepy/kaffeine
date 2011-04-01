require.module('./plugins/default_args', function(module, exports, require) {
// start module: plugins/default_args

var Token = require("../token");

module.exports = function(stream) {

  stream.each(function() {
    if(this.text != "function") return 
    var block = this.block
    var bracket = this.block.prevNW().matching
    
    var inserts = []
    this.find(function() {    
      if(this == bracket.matching) return true
      if(this.text == "=") {
        var v = this.prev.text
        var e = this.next.expressionEnd(function() {
          if(this.text == ",") return true
        })
        var val = this.next.remove(e).collectText()
        var ret = this.prev
        this.remove()
        
        inserts.push(v +" = " + v + "==null ? " + val + " : " + v)
        return ret
      }
    })
    
    if(inserts.length)
      this.block.after(" " + inserts.join(", ") + ";")
    
    block.args = block.findArgs()
  })
}



// end module: plugins/default_args
});
