#backticks

add = `this + #`
Times = `#1*#2`
eq(Times(1,2), 2)

eq(`#*#`(3), 9)

eq(`.length`("name"), 4)

eq(`< 2`(1),  true)