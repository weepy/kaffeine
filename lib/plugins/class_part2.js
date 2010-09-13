var Token = require("../token");

exports['class_part2'] = function(stream) {
  stream.each(function() {
    if(this.text != "function" || !this.klass) return
    
    var curly = this.find(function() { 
      if(this.lbracket && this.curly) return true
    })

    stream.global.vars["__extends"] = __extends
    
    if(this.superClass) {
      curly.matchingBracket.after(new Token.word( "\n" + this.indent() + "__extends(" + this.klass +  ", " + this.superClass  + ")"))
      curly.superClass = this.superClass || "undefined"
    }
    
    curly.updateBlock()
    curly.klass = this.klass || "undefined"
    var s = this.indent() + "  return this;"
    if(curly.matchingBracket.newline)
      s = "\n" + s
    else
      s = s + "\n"
    curly.matchingBracket.before(s)
  })
}



var __extends = (function(child, parent) {
  var ctor = function(){};
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.prototype.constructor = child;
  if (typeof parent.extended === "function") parent.extended(child);
  child.__superClass__ = parent.prototype;
}).toString()