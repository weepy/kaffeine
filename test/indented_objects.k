x = a : 1
eq(x["a"], 1)

x = a: 
      b: 1,
      c: 
        [
          1
        ],

eq(x.a.c[0], 1)

