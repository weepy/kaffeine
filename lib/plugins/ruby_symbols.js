var Token = require("../token")

module.exports = function(stream) {

  stream.each(function(token) {
    Token.current_token = this
       
    if(this.text != ":" || !this.next.word) return
    var text = this.myText()
    
    if(!text.match(/^[ \n]:$/) && this.prev && !this.prev.lbracket && !this.prev.operator) return
    //   {
    //   // var text = this.prev.text
    //   // if(text != ":" && text != "," && this.prev ) return
    // }
    var text = this.myText().replace(/:$/,"") + "'" + this.next.text + "'"
    this.next.remove()
    var token = this.replaceWith(text)
    return token
  })
}


