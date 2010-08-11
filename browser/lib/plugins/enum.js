require.module('./plugins/enum', function(exports, require) {
// start module 

// mixes in some nice enum functions - normally used for | pipe
exports.enum = function(stream, Token) {
  var Enum = "function map(x, fn) {\n\
  var ret = []\n\
  for(var i in x)\n\
    ret.push(fn.call(x[i], i))\n\
};\n\
function detect(x, fn) {\n\
  for(var i in x) {\n\
    if(fn.call(x[i], i)) return x[i]\n\
  }\n\
};"
  stream.before(new Token.word(Enum))
}

// end module
})