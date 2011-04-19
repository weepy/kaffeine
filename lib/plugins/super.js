var Token = require("../token");

module.exports = function(stream) {

  stream.each(function() {
    if(this.blockType != "function") return 
    

    var class_name = this.class_name
    var super_class_name = this.super_class_name


    var curly = this
    var super = curly.next.find(function() {
      if(this.text == "super") return true
      if(this.matching == curly) return false
      if(this.blockType == "function") return this.matching.next
    })

    if(super) {
      var brack = super.nextNW()

      if(brack.lbracket) {

        brack.nextNW() != brack.matching
          ? brack.after("this, ")
          : brack.after("this")
        brack.before(".call")
      }
      else {
        super.after("(this, arguments)")
        brack = super.nextNW()
        brack.before(".apply")
      }
      

      if(this.class_name) {
          super.replaceWith(this.super_class_name)
      } else {
        var eq = curly.blockTypeNode.prevNW()
        if(!eq.assign) throw "don't know which method to call for super"
        var method = eq.prevNW().text
        super.replaceWith("this.__super__." + method )
      }
  }
   else {
      if(this.class_name && this.super_class_name) {
        curly.nextNW().before(this.super_class_name + ".apply(this, arguments); ")
      }
    }
  })
}



