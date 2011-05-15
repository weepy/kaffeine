var Token = require("../token");
module.exports = function(stream) {
  var reg = /\n/

  stream.each(function() {
    Token.current_token = this
    
    if(!this.string || !reg.test(this.text)) return
    
    this.text = this.text.replace(/(\\)?\n/g, function(str, escape) {
      return escape ? "\\\n" : "\\n\\\n"
    })
  })
}