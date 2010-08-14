#half_operators

var name = "john"
name = .toUpperCase()
ok(name == "JOHN")

var a = {}
a.x = || 5
eq(a.x, 5)