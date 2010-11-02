require.module('./plugins/arrow', function(module, exports, require) {
// start module: plugins/arrow

var Token = require("../token");

exports.arrow = function(stream) {
  stream.each(function(token) {
    
    if(token.text != "->") return
    
    var text = "function"
    if(token.next.text != "(")
      text += "()"

    var curly = this.find(function() {
      if(this.curly && this.lbracket) return true
    })
    
    this.replaceWith(text)
    
    curly.updateBlock()
    return curly
  })
}


// end module: plugins/arrow
});
