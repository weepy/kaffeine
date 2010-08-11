require.module('plugins/wrapper', function(exports, require) {
// start module 

exports.wrapper = function(stream, Token) {
  stream.before(new Token.word(";(function(){\n"))
  stream.tail().after(new Token.word("\n})();"))
}

// end module
})