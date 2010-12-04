#implicit_object_keys


var x = 1, y = 2, z= 3
a = { x,y:[x],z }
eq(a.z, 3)

a = { x,
      y:[],
      z 
    }
        
eq(a.z, 3)


b = 3

a = { x:
       { a: 1 },
       b
    }
