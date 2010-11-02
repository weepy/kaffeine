# backticks pipe

var x = 1
| = {}
|.map = function(A, fn) {
  var ret = []
  for(var i in A) {
    ret.push(fn.call(A[i], A[i], i))
  }  
  return ret
}
|.detect = function(A, fn) {
  var ret = []
  for(var i in A) {
    var a = A[i]
    if(fn.call(a, a, i)) {
      return a
    }
  }  
}

var x = [2] | map `#*#`
eq(x[0], 4)

var x = [1,2,3,4,5,6,7] | map `#*#` | detect `#>10`

eq(x, 16)
