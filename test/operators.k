#kaffeine operators arrow indented_blocks implicit_return
operator Number \ = (R) -> Math.floor(this/R)
operator Number ** = (R) -> Math.pow(this, R)
operator Array << = (R) -> this.push(R)

function addOne(x) {
  return x + 1
}

eq( 8\3, 2)
eq( 2**3, 8)

var power = 2

x = addOne(1) ** power + (5\4)

var a = [1]
a << 2; 
eq(a.length, 2)

(x = []) << 4
eq(x[0], 4)

//(higher precidence than normal operators)
eq(2 + 3 ** 2, 11)  // interpreted as 2 + (3 ** 2)  

//(left is higher precidence than right)
eq(7 \ 2 ** 2, 9)  // interpreted as (7 \ 2) ** 2 

// x
// we need to figure out where to insert some semi colons - as the extra brackets can cause problems