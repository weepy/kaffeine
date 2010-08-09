require.module('lib/plugins/wrapper', function(exports, require) {
//////////////////////


exports.wrapper = function(stream, Token) {
  stream.before(new Token.word(";(function(){\n"))
  stream.tail().after(new Token.word("\n})();"))
}


/////////////////////////
})