var Token = require("../token");
exports['prototype'] = function(stream) {

  var klass = "undefined"
  stream.each(function() {
    
    if(this.namedFunction) {
      klass = this.namedFunction.text
      return
    }

    if(this.word && this.text == "prototype") {
      if(this.prev.op == ".")
        klass = this.prev.prev.text
      return
    }
    
    var ret = this.next
    
    if(this.op == "::") {
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

