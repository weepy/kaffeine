#arrow

var x = (a) -> { return a }

ok( x(true) )

var x = -> { return false }
ok( ! x() )

ok( (-> { return true }) )


x = (a) -> {
  a = this.a
  a
}

var square = (x) -> x * x

eq(square(2), 4)