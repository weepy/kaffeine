require.module('./plugins/super', function(module, exports, require) {
// start module: plugins/super

var Token = require("../token");
exports['super'] = function(stream) {

  stream.each(function() {
    if(!this.curly || this.blockType != "function") return
      
      var curly = this
      curly.next.each(function() {
        if(this == curly.matchingBracket) return true
        if(this.blockType == "function") return this.matchingBracket // skip over inner functions
        
        if(this.word && this.text == "super") {
          if(this.next.lbracket && this.next.round) {
            argWord = this.next.remove(this.next.matchingBracket).collectText().replace(/^ *\(/,"").replace(/ *\)$/, "")
            if(argWord.length > 0) argWord = ", " + argWord 
            var text = curly.klass + ".__super__.constructor.call(this" + argWord + ")"
          } else {
            var text = curly.klass + ".__super__.constructor.apply(this, arguments)"          
          }
          this.replaceWith(Token.ize(text))
        }

      })
    
  })
}



// end module: plugins/super
});
