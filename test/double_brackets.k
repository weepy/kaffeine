#double_brackets

function a() {
  var x = ((1))
}

function A() {
  var x = (1)
}

eq(a.toString().toLowerCase(), A.toString().toLowerCase())
eq(a.toString().length, A.toString().length)