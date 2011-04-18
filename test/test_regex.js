var regex = require("../lib/token").regex
var assert = require("assert")

var x = "/\"/g, '\\\\\"'"


console.log(x, ":", regex.extract(0, x))
x = "/\\\\/g"
console.log(x, regex.extract(0, x))
