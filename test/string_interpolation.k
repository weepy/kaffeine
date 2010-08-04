#kaffeine multiline_strings string_interpolation brackets_for_functions
var greet = "hello", bye = "bye", name = "james", age = 20

alert "${greet}
$name 
#{bye}
#name
"
alert "$name is ${age * 12} months old. ${"this is a string inside a interp"}"