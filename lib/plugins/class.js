var Token = require("../token");





module.exports = function(stream) {
  var insert = false

  stream.each(function() {
    Token.current_token = this

    if(this.text != "class") return
    if(this.nextNW().text == ":") {
      this.text = "'class'"
      return
    }

    this.text = "function"

    var x = this.next.next

    if(x.curly) {
      throw "anonymous class"// anonymous class
    }

    var insert_extends = false
    var class_name = x.text


    if(!x.next.lbracket || !x.next.round) x.after("()")

    var next = x.next.matching.nextNW()

    var super_class_name = null

    if(next.text == "extends") {
      insert = insert_extends = true

      var super_class = next.next.next
      var end = super_class.expressionEnd()

      var after = end.nextNW()
      super_class_name = super_class.collectText(end)
      // console.log(super_class.text, end.text, "XXXXXXXXXXXXXX")
      // console.log(super_class_name)
      var expr = super_class.remove(end)

      next.next.remove()
      next.remove()
      next = after
    }

    if(next.curly && next.lbracket) {
      curly = next
    }
    else {
      x.next.matching.after("{;}")
      curly = x.next.matching.next
      curly.inserted_body = true
    }

    if(!curly.matching.next.semi) curly.matching.after(";")
    if(insert_extends)
      curly.matching.next.after(" __extends(" + class_name + ", "+ super_class_name + ");")

    curly.updateBlock()
    curly.class_name = class_name;
    if(super_class_name) curly.super_class = super_class_name


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
