var Token = require("../token")

module.exports = function(stream) {

  stream.each(function(token) {    
    if(this.text != ":" || !this.next.word) return
    var text = this.myText()
    
    if(!text.match(/^[ \n]:$/) && this.prev && !this.prev.lbracket && this.prev.text != ":") return

    var text = this.myText().replace(/:$/,"") + "'" + this.next.text + "'"
    this.next.remove()
    var token = this.replaceWith(text)
    return token
  })
}


