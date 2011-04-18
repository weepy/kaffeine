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