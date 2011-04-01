#arrow

var x = -> (a) { return a }

ok( x(true) )

var x = -> { return false }
ok( ! x() )

ok( (-> { return true })() )


x = -> (a) {
  a = this.a
  a
}


-> namedFn(ohyeah) {
  
}