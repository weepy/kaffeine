#kaffeine backticks

Times = `#1*#2`
eq(Times(1,2), 2)

eq(`#*#`(3), 9)