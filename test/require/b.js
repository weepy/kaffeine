require.module("b", function(exports, require) {
  exports.one = require("./a").one
  exports.two = require("./c/c").two
})