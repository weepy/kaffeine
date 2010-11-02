var Token = require("../token");
exports.linenumbers = function(stream) {
  var count = 0, next
  stream.each(function() {
    next = this.next
    if(next && next.text == "\n") {
      count ++;
      this.after(" // "+count)
      return next
    }
  })
}
