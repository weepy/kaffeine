#kaffeine multiline_strings string_interpolation brackets_for_functions

eq( "\$name", "$" + "name" )

var greet = "hello", bye = "bye", name = "james", age = 20
var obj = {x:{x:1}}

eq "${greet}
$name 
${bye}
$name
".split("\n").length, 5

eq( "$obj.x.x", "1" )

x = " ${"this is a string inside a interp"} "

eq(x, " this is a string inside a interp ")