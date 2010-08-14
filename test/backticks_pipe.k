#utils backticks pipe

var x = [2] | map `#*#`
eq(x[0], 4)

var x = [1,2,3,4,5,6,7] | map `#*#` | detect `#>10`

eq(x, 16)
