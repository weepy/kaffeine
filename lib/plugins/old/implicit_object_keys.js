var Token = require("../token");
exports.implicit_object_keys = function(stream) {

  stream.each(function() {
    if(this.blockType && this.blockType == "object") {
      var L = this, R = this.matchingBracket
      var foundColon = false
      var end = L.next.find(function() {
        if(this == R) {
          if(!foundColon) {
            if(this.prev == L)
              return
            var text = this.prev.whitespace ? this.prev.prev : this.prev
            this.before(": " + text.text)          
          }

          return true
        }
        if(this.lbracket) return this.matchingBracket.next // skip over

        if(this.op == ":")
          foundColon = true

        if(this.op == ",") {
          if(!foundColon)
            this.before(": " + this.prev.text)
          foundColon = false
        }
      }) 
    }
  })
}
