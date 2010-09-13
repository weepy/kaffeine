# existential

false ? 1 : 3

x = 10

if(x?) {
  ok(true)
} else 
  ok(false)

if(x?.toString())
  ok(true)
else
  ok(false)
  
if(Math.floor(x)?.toString())
  ok(true)
else
  ok(false)