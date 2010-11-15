require.module('./plugins/multiline_strings', function(module, exports, require) {
// start module: plugins/multiline_strings

var Token = require("../token");
module.exports = function(stream) {
  var reg = /\n/
  stream.each(function() {
    if(!this.string || !reg.test(this.text)) return
    
    this.text = this.text.replace(/(\\)?\n/g, function(str, escape) {
      return escape ? "\\\n" : "\\n\\\n"
    })
  })
}

// end module: plugins/multiline_strings
});
