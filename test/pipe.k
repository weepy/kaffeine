exports.map = (o, fn) {
  ret = []
  for key, val in o
    ret.push fn(val, key) 
  ret 
}

exports.detect = (o, fn) {
  for key, val in o {
    if fn(val, key)
      return val
  }
}

exports.times = (n, fn) {
  for var i=0; i < n; i++
    fn.call @, i 
}
