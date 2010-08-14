#englify at backticks arrow unless brackets_for_keywords reverse_blocks indented_blocks brackets_for_functions implicit_vars operators implicit_return implicit_vars half_operators 

unless false
{
  ok(true)
} else {
  ok(false)
}

x = y = true

f = -> 9

unless x and y or f() isnt 10 and not false
  x = true
  ok x

eq(true, true) if x is y

if @x == @@Array || @.x == @ || @@.x == @@
  return