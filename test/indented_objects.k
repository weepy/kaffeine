#kaffeine indented_objects

A = x: 
       1

C = a : 1
eq(C["a"], 1)


B = s: 1,
    t: 2
       

               
A = x: 
      y: 1,
      z: 
        [
          1
        ]

eq(A.x.z[0], 1)

