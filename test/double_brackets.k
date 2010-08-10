#kaffeine double_brackets

function a() {
  var x = ((1))
}

function b() {
  var x = (1)
}

eq(a.toString(), b.toString())
