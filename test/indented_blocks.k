#kaffeine indented_blocks

if(true)
  ok(true)

function b() ok(true)
b()

function A(arg, arg2)
  var i = 1
  ok(true)
A()


var x

if(true)
  ok(true)
  ok(true)
    ok(true)
  for(var x in [1])
    ok(true)
      ok(true)
  if(true)
      ok(true)
    ok(true)
else if(false)
  ok(false)
else
  var i = 1
  ok(false)
  

class Animal(alive)
  this.alive = alive
  


var AnonymousClass = class()
  this.superWontWork = true

try
  throw "error"
catch(e)
  ok(true)

var error = true
if(false) //  no indent - just assume it's a single line!
ok(true)
error = false

ok(error)