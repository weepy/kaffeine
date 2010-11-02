#async

function add(x, y, callback) {
  callback(x + y)
}

sum = add!(3, 4)
ok(sum == 7)

/*

add(3, 4, function(sum) {
  ok(sum == 7)
})

*/