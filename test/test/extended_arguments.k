#extended_arguments

function K(x=5,y, z = 10) {
  eq(x,5)
  eq(z, 10)
}
K()

function A(this.x, this.y) {
  
}

var a = new A(5,3)
eq(a.x, 5)
eq(a.y, 3)


function A(this.x = 1, this.y=2) {
  
}

var a = new A()
eq(a.x, 1)
eq(a.y, 2)