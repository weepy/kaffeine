#kaffeine brackets_for_functions
function div(x, y) { return x / y} 
function sq(x) { return x * x} 



eq( (sq 1 + 2), 9)
eq( (1 + sq 2), 5)
if(sq(sq 2) == div 32, 2)
  ok(true)
else
  ok(false)

x = sq sq 3
eq(x, 81)

var pass = false
if(true) {
  pass = true
}
ok(pass)

x = [ok,0][0] true 


for(i in [1,2,3,2*2])
  ok true

