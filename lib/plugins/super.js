var Token = require("../token");

module.exports = function(stream) {
 // console.log("------")
  stream.each(function() {
    
    // require("util").print(this.text)

    if(this.blockType != "function") return 

    var class_name = this.class_name
    var super_class = this.super_class


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
        super.replaceWith("this.constructor.__super__")
      } else {
        var eq = curly.blockTypeNode.prevNW()
        if(!eq.assign) throw "don't know which method to call for super"
        var method = eq.prevNW().text
        super.replaceWith("this.__super__." + method )
      }
  }
    else {
      if(this.class_name && this.super_class && this.inserted_body) {
        curly.nextNW().before(" this.constructor.__super__.apply(this, arguments)")
      }
    }
  })
}



