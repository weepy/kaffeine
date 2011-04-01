require.module('./plugins/hash', function(module, exports, require) {
// start module: plugins/hash

var Token = require("../token");

module.exports = function(stream) {

  stream.each(function() {
    if(this.unknown && this.text == "#") {
      var word = "arguments"
      
      if(!this.next.word)
        word += "[0]"
      else {
        word += "[" + this.next.remove().collectText() + "]"
      }
      ret = this.next
      this.replaceWith(word)
      return ret
    }
  })
}



// end module: plugins/hash
});
