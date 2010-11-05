#pipe implicit_vars arrow implicit_return

x = 1
| = {}
|.map = ->(A, fn) {
  ret = []
  for(i in A) {
    ret.push(fn.call(A[i], A[i], i))
  }  
  ret
}
|.detect = ->(A, fn) {
  ret = []
  for(i in A) {
    a = A[i]
    if(fn.call(a, a, i)) {
      return a
    }
  }
}

square = -> (x) { x * x }
more_than_10 = -> (x) { x > 10 }

var x = [2] | map square
eq(x[0], 4)

var x = [1,2,3,4,5,6,7] | map square | detect more_than_10
eq(x, 16)