#bang

function add(x, y, callback) {
  callback(x + y)
}

sum = add!(3, 4)
ok(sum == 7)
