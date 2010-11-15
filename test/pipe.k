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