#kaffeine brackets_for_keywords

for x in [1,2,3,2*2] {
  ok(true)
}

if true// hello
  ok(true)
  
if true {
  ok(true)
}

if false {
  ok(false)
}
else {
  ok(true)
}

for var i=0; i<1; i++ {
  ok(true)
}

while i == 1 {
  ok(true)
  i = 0
}

if !false
  ok(true)
  
