#kaffeine indented_objects

x = a : 1
eq(x["a"], 1)


x = a: 1,
    b: 2
       
       
x = x: 
      b: 1,
      c: 
        [
          1
        ]

eq(x.x.c[0], 1)

