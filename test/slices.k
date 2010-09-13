#slices

var x = [1,2,3,4]

same(x[0..1], [1])
same(x[0...3], [1,2])
same(x[1..], [2,3,4])
same(x[1...], [2,3,4])
same(x[...], x)
same(x[..], x)

var x = "1234"

eq(x[0..1], "1")
eq(x[0...3], "12")
eq(x[1..], "234")
eq(x[1...], "234")
eq(x[...], x)
eq(x[..], x)

function getNextNode() {
  return [1,2,3,4]
}

same( getNextNode()[1..3], [2,3]) 

same( getNextNode()[0..], [1,2,3,4]) 