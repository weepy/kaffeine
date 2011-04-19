var Token = require("../token");

module.exports = function(stream) {
  var insert = false
  stream.each(function() {
    if(this.text != "class") return 
    
    this.text = "function"
     
    var x = this.next.next

    if(x.curly) {
      throw "anonymous class"// anonymous class
    }

    var class_name = x.text
    if(!x.next.lbracket || !x.next.round) x.after("()")

    var curly = x.next.matching.nextNW()
    if(!curly.curly) {
      if(curly.text != "extends") {
        throw "unknown error in class definition"
      }
      insert = true
      var super_class = curly.next.next
      var xcurly = super_class.nextNW()
      curly.remove(super_class)
      curly = xcurly

      curly.matching.after("\n__extends(" + class_name + ", "+ super_class.text + ")")
      curly.super_class_name = super_class.text     
    }

     curly.updateBlock()
     curly.class_name = class_name
    
  })

  if(insert) {
    var g = stream.block
    if(!g.global) throw "WTF!"
    g.matching.before(new Token.word(__extends.toString()))
  }


}


function __extends(child, parent) {
  var __hasProp = Object.prototype.hasOwnProperty;
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};


