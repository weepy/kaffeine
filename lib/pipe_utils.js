require.module('./pipe_utils', function(module, exports, require) {
// start module: pipe_utils

exports.map = function(A, fn) {
  var ret = []
  for(var i in A) {
    ret.push(fn.call(A[i], A[i], i))
  }  
  return ret
}

exports.detect = function(A, fn) {
  var ret = []
  for(var i in A) {
    var a = A[i]
    if(fn.call(a, a, i)) {
      return a
    }
  }  
}

// end module: pipe_utils
});
