#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
//var lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');

var Kaffeine = require("../lib/kaffeine").Kaffeine

var assert = require("../lib/assert").assert
// mixin locally
for(var name in assert)
  eval("var " + name + " = assert['" + name + "']")

function loadPlugins(source) {
  var rel = "../lib/plugins/"
    
  files = fs.readdirSync(source) 
  for(var i =0; i< files.length;i++) {
    var file = files[i]
    if(!file.match(/\.js$/)) continue
    file = file.replace(/\.js$/, "")
    var path = rel + file
    Kaffeine.plugins[file] = require(path)[file]
  }
}

loadPlugins("./lib/plugins")

var run = require("../lib/test").run


function runTest(name) {
  var text = fs.readFileSync("./test/" + name +".k").toString()
  console.log("Running " + name)
  reset()
  try {
    var js = new Kaffeine().compile(text)
  } catch(e) {
    console.error(e.toString())
  }

  try {
    eval(js)
  } catch(e) {
    console.log("Doesn't produce valid JS ")
    console.log( e.toString())
    console.log(js)
  }

  console.log("Test finished")
  console.log(results().passes + " pass, " + results().fails + " fail")
}

function runAllTests() {
  fs.readdir("./test", function(err, files) {
    for(var j=0; j<files.length;j++) {
    var file = files[j]
    if(file.match(/.k$/))
      runTest(file)
    }
  })
}

var ARGV = process.ARGV

if(ARGV[2])
  runTest(ARGV[2])





