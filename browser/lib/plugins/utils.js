require.module('./plugins/utils', function(module, exports, require) {
// start module: plugins/utils

var Token = require("../token");

exports.utils = function(stream) {
  var text = ""
  for(var i in mixin) {
    text += mixin[i].toString() + "\n"
  }
  stream.global.next.after(new Token.word(text))
  return stream.prev
}



var mixin = {
  map: function map(x, fn) {
    var results = []
    for(var i in x) {
      results.push(fn.call(this, x[i]))
    }
    return results
  },

  detect: function detect(x, fn) {
    for(var i in x)
      if(fn.call(this, x[i]))
        return x[i]
  }
}

// end module: plugins/utils
});
