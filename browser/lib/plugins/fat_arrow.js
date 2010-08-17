require.module('./plugins/fat_arrow', function(module, exports, require) {
// start module: plugins/fat_arrow

var Token = require("../token");
exports.fat_arrow = function(stream) {  
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

// end module: plugins/fat_arrow
});
