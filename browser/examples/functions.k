// use -> as a simple function definition
x = -> 123

// braces are optional,  args placed before ->
x = (a,b,c) -> {
  return 123
}

/* indentation is used to express braceless code blocks  */
x = () ->
  return 123

// the last value is returned implicitly
add = (a,b,c) ->
  a+b+c

curry = -> -> 123

// standard form is useful for named functions
function myFunction() {
  
}
