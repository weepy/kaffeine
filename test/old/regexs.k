#arrow
var x = /a/g

eq("a a".match(x).length, 2)

var p = 4, h = 2, g = 2

eq( p / h/g, 1)

ok( /x[/]*/g.test( "x" ) )

