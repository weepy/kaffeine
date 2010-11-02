var Token = require("../token");

function __extends(child, parent) {
  var ctor = function(){};
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.prototype.constructor = child;
  if(typeof parent.extended === "function") 
    parent.extended(child);
  child.__super__ = parent.prototype;
}



exports['class_part2'] = function(stream) {
  var endBracket = stream.global.matchingBracket;
  var __extendsString = __extends.toString() + "\n"
  
  stream.each(function() {
    if(this.text != "function" || !this.klass) return
    
    var curly = this.find(function() { 
      if(this.lbracket && this.curly) return true
    })

    //stream.global.vars["__extends"] = __extends
    
    //if(!inserted)
    if(__extendsString) {
      endBracket.before(__extendsString)  
      __extendsString = null
    }
        
    if(this.superClass) {
      curly.matchingBracket.after(new Token.word( "\n" + this.indent() + "__extends(" + this.klass +  ", " + this.superClass  + ")"))
      curly.superClass = this.superClass || "undefined"
    }
    
    curly.updateBlock()
    curly.klass = this.klass || "undefined"
    var s = "\n" + this.indent() + "  return this;"
    if(!curly.matchingBracket.newline)
      s += "\n"

    curly.matchingBracket.before(s)
  })
}

