#implicit_return

Number.prototype['\\'] = function(R) { Math.floor(this/R) }

function A() { 1 }
eq( A(), 1 )

eq( (function() {
  ;1234;
})(), 1234)
  
same( (function() {
  {a: 1}  
})(), {a: 1})

ok( (function() {
  if(false) {
  } else {
  
  }
})() == null)

eq((function() {
  return 1234  
}
)(), 1234)

eq((function() {
  (function() {123})
})()(), 123)