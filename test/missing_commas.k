#missing_commas

a = [
  1
  2 *
    2
    3
]

eq(a.length, 3)



eq([
1
 2
  3
 4
5  
]
.length
, 5)