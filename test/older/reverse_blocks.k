#unless brackets_for_keywords reverse_blocks

function x(x) {
  return true if x == 1
  return true if(x == 2)
}

x(1)
x(2)

ok(true), ok(true) unless false

var i = 1

ok(true), i-- while i > 0

ok(true) for(i in [1])