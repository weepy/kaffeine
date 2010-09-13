#extend_for

for(x of [1,2,3,4]) {
  ok(true)
}

var g = []
for(i=0; i<g.length; i++) {

}

var A = {ok: ok, ok2: ok}, B = {eq: eq}
for(i in A) {
  A[i](true)
}


for(i, v in A) {
  v(true)
  for(j, v2 in B) {
    v2(j, "eq")
  }
}

var sum = 0
for(x of [1,2,3,4,5,6]) {
  sum += x
}

eq(sum, 21)

function Complex() {
  return [1,2]
}

for(x of Complex()) {
  sum += x
}

eq(sum, 24)


