#kaffeine indented_blocks

if(true)
  ok(true)

function b() ok(true)
b()

function A()
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
  




try
  throw "error"
catch(e)
  ok(true)

if(true) //  this probably should throw an error? 
ok(true)
