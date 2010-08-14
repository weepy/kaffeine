require.module('./plugins/fat_arrow', function(exports, require) {
// start module 

exports.fat_arrow = function(stream, Token) {  
  stream.each(function() {
    if(this.op != "=>") return

    this.op = "->"
    this.text = this.text.replace("=>", "->")
    var pair = Token.bracket.pair("()")
    this.before(pair.L).before("__bind")
    this.next.matchingBracket.after(", this").after(pair.R)
    
    stream.global.vars["__bind"] = __bind
  })
}

var __bind = (function(func, context) {
    return function(){ return func.apply(context, arguments); };
  }).toString();

// end module
})