// Assignment:

number   = 42
opposite = true

// Conditions:
number = -42 if opposite

// Functions:
square = (x) -> x * x

// Arrays:
list = [1, 2, 3, 4, 5]

// Objects:
math =
  root:   Math.sqrt
  square: square
  cube:   (x) -> x * square x

// Splats:
// race = (winner, runners...) ->
//  print winner, runners

// Existence:
// ?? tests for typeof X != "undefined"
// ? tests for X != null
alert "I knew it!" if elvis??

// Array comprehensions:
// not supported

cubes = []
for num, i of list
  cubes[i] = math.cube num
