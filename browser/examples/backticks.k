/* backticks provide a shorthand for lamda expressions */

// typically # will specify the first argument
sq = `#*#`

// but we can have more
add = `#+#2+#3`

// if an expression starts with an operator, the argument is implied
adultFilter = `>=18`

// useful with the | (pipe) operator