# destructured_assignment

[a, b] = [1 , 0]
[a, b, [c, [d]]] = [1 , 0, [2,[3,4,5]]]
eq(b, 0)
eq(d, 3)
// 
// {x, y, z: [a, b]} = {z:[1]}
// eq(a,1)
// eq(y, undefined)
