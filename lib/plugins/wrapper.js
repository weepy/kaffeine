require.module('./plugins/wrapper', function(module, exports, require) {
// start module: plugins/wrapper

exports.wrapper = function(stream) {
  stream.before(new Token.word(";(function(){\n"))
  stream.tail().after(new Token.word("\n})();"))
}

// end module: plugins/wrapper
});
