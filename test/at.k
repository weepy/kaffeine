#at

function A() {
  @x = 3
}

A.x = 2

A.prototype.test = function() {
  eq(@x, 3)
  eq(@@x, 2)
}

var a = (new A())
a.test()