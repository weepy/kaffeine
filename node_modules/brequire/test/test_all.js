var brequire = require("brequire"),
    is = require("should"),
    fs = require("fs")

exports.test_construct = function() {
  var br = brequire("./") 
  is.ok(br instanceof brequire)
}

exports.test_relative = function() {
  var br = brequire("./test/shape") 
  br.root.should.eql(__dirname + "/shape")
  br._files().should.eql(["pi.js", "shape.js", "shapes/circle.js"])
  
  br._module_base.should.eql("./")
  br._modules().should.eql(["./pi.js", "./shape.js", "./shapes/circle.js"])
  br.module_base("./x")
  
  br._modules().should.eql(["./x/pi.js", "./x/shape.js", "./x/shapes/circle.js"])
}

exports.test_single_file = function() {
  var br = brequire("./test/single/single.js")
  br.write("./test/browser/lib/single")
}

exports.test_paths = function() {
  var br = brequire("./test/shape").search("*.js","shapes/*.js") 
  br.root.should.eql(__dirname + "/shape")
  // br.paths.should.eql(["*.js"])
  br._files().should.eql(["pi.js", "shape.js", "shapes/circle.js"])
  
  br._module_base.should.eql("./")
  br._modules().should.eql(["./pi.js", "./shape.js", "./shapes/circle.js"])
  br.module_base("./xx")
  
  br._modules().should.eql(["./xx/pi.js", "./xx/shape.js", "./xx/shapes/circle.js"])
}


exports.test_static = function() {
  var br = brequire("sam") 
  br._files().should.eql([ 'index.js',
    'uglify/parse-js.js',
    'uglify/process.js' ]
  )
  
  br._modules().should.eql([ 'sam/index.js',
    'sam/uglify/parse-js.js',
    'sam/uglify/process.js' ]
  )
  
  br.module_base("not_sam")
  br._modules().should.eql([ 'not_sam/index.js',
    'not_sam/uglify/parse-js.js',
    'not_sam/uglify/process.js' ]
  )
}

var exec  = require('child_process').exec

exports.test_out = function() {
  brequire("./test/shape")
    .include_lib()
    .write("./test/browser/lib/shape.bundle.js")

  brequire("./test/shape")
    .include_lib()
    .write("./test/browser/lib")

  brequire("./test/user")
    .module_base("user_alt")
    .write("./test/browser/lib/user_alt.bundle.js")

  exec("open ./test/browser/test_brequire.html")
}

exports.test_same_as_browser = function() {
  is.ok(require("./single/single.js") == "single!") 
  is.ok(require("./single/single") == "single!")
}


