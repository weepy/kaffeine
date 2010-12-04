require.module('./plugins/prototype', function(module, exports, require) {
// start module: plugins/prototype

var Token = require("../token");
module.exports = function(stream) {

  var klass = ""
  stream.each(function() {
    
    if(this.namedFunction) {
      klass = this.namedFunction.text
      return
    }

    if(this.word && this.text == "prototype") {
      if(this.prev.text == ".")
        klass = this.prev.prev.text
      return
    }
    
    var ret = this.next
    
    if(this.text == "::") {
      this.spit(function() { return this.whitespace})
      var text = ".prototype."
      if(this.prev.word)
        klass = this.prev.text
      else
        text = klass + text
      this.replaceWith(text)
    }
    return ret
  })
}



// end module: plugins/prototype
});
