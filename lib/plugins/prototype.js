var Token = require("../token");
module.exports = function(stream) {

  var klass = ""
  stream.each(function() {
    Token.current_token = this
    
    
    // if(this.namedFunction) {
    //   klass = this.namedFunction.text
    //   return
    // }

    if(this.class_name) {
      klass = this.class_name
    }

    // if(this.word && this.text == "prototype") {
    //   if(this.prev.text == ".")
    //     klass = this.prev.prev.text
    //   return
    // }
    
    var ret = this.next
    
    if(    this.text == "::" 
        && !this.myText().match(" ") 
        && (this.prev.word || this.next.word)) {

      //this.spit(function() { return this.whitespace})
      var text = ".prototype."
      if(this.prev.word) {
        klass = this.prev.text
        this.prev.prototype_klass_name = klass
      }
      else
        text = klass + text

      this.spitLeft()
      this.replaceWith(text)
    }
    return ret
  })
}


