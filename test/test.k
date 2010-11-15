| = require("./pipe")

console.log "whoop. success"


for i of [11,22,33,44]
  console.log i

x = [1,2,3,4]

val = x | map { # * 11 } | detect { #*# > 30 }
console.log val == 11