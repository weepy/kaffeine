#!/usr/bin/env node

var sys   = require('sys'),
    exec  = require('child_process').exec,
    child,
    fs = require("fs"),
    text = "var a;\n\n\n\nvar b=1+1;\n\nc=9"

text = "function __validate() {\n"  + text + "}"
fs.writeFileSync("_test.js", text)

child = exec('node _test.js', 
  function (error, stdout, stderr) {
   sys.print('stdout: ' + stdout);
   sys.print('stderr: ' + stderr);
    if (error !== null) {
      //console.log('exec error: ' + error);
      //  console.log(error.stack.join(" \n\n"))
        var s= error.stack//.join("\n")
      console.log(typeof s)
       var line = s.match(/_test\.js\:([0-9]+)/)[1]
      console.log(line)
console.log("ok")
    }
});