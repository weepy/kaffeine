var Token = require("../token");

module.exports = function(stream) {
  stream.each(function() {
    Token.current_token = this

    if(this.blockType != "function") return

    var class_name = this.class_name
    var super_class = this.super_class


    var curly = this

    var _super = curly.next.find(function() {
      if(this.text == "super") return true
      if(this.matching == curly) return false
      if(this.blockType == "function") return this.matching.next
    })

    if(_super) {
      var brack = _super.nextNW()

      if(brack.lbracket) {

        brack.nextNW() != brack.matching
          ? brack.after("this, ")
          : brack.after("this")
        brack.before(".call")
      }
      else {
        _super.after("(this, arguments)")
        brack = _super.nextNW()
        brack.before(".apply")
      }

      if(this.class_name) {
        _super.replaceWith(this.class_name + ".__super__.constructor")
      } else {

        var eq = curly.blockTypeNode.prevNW()
        if(!eq.assign) throw "don't know which method to call for super"
        var method = eq.prevNW()

        var start = method.expressionStart()
        var text = start.collectText(method)
        var caller
        if(text.match(".prototype.")) {
          caller = text.split(".prototype.")[0]
        } else {
          caller = text + ".constructor" //replace(/\.$/,"")
        }
        _super.replaceWith(caller + ".__super__." + method.text )
      }
    }
    else {
      if(this.class_name && this.super_class && this.inserted_body) {
        curly.nextNW().before(" " + this.class_name + ".__super__.constructor.apply(this, arguments)")
      }
    }
  })
}



