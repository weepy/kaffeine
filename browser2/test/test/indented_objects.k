#indented_objects

A = x: 1

C = a: 1


C = e: [
        ]
            
C = a: 1
    b: 21
    d: c: 1
       d: 2
       e: [
            ]
B = d: c: 1
       e: 1




eq(C["a"], 1)
var square = function(x) { return x*x}

math =
  root:   Math.sqrt
  square: square

math = root:   Math.sqrt()
       square: square
    



eq(C.d.c, 1)



B = s: 1,
    t: 2

A = x: 
      y: 1,
      z: 
        [
          1
        ]

eq(A.x.z[0], 1)

/*
function label(a,b) { ok(b) } 

label(for: 'username', 'Username')
*/