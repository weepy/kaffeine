require.module('./shapes/circle.js', function(module, exports, require) {
// start module: ./shapes/circle.js

var pi = require("../pi"),
    shape = require("../shape")

function Circle(r) {
  this.radius = r
}

Circle.__proto__ = shape

Circle.prototype.area = function() {
  return pi * this.radius * this.radius
}
module.exports = Circle

// end module: ./shapes/circle.js
});
