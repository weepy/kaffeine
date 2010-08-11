require.module('./plugins/prototype', function(exports, require) {
// start module 

exports['prototype'] = function(stream, Token) {

  var klass = "undefined"
  stream.each(function() {
    
    if(this.klass) {
      klass = this.klass
      return
    }
    
    if(this.word && this.text == "prototype") {
      if(this.prev.op == ".")
        klass = this.prev.prev.text
      return
    }
    
    var ret = this.next
    
    if(this.op == "::") {
      this.unhungry()
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



// end module
})