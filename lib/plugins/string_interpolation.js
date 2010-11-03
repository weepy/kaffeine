var Token = require("../token");
exports.string_interpolation = function(stream) {
  stream.each(function() {
    if(!this.string) return
    
    // combine nested
    if(/#{"$/.test(this.text)) {
      var text = ""
      var end = this.next.find(function() {
        text += this.text
        if(this.string && /^"}/.test(this.text))
          return true
      })
      this.text += text
      this.next.remove(end)
    }
    
    if(/^".*[#]/.test(this.text))
      this.text =  expandOnce(this.text)
  })
}

// partially borrowed from visionmedia's Jade
//var regSimple = /(\\)?[$]([A-Za-z0-9.@_]+)/g
var regComplex = /(\\)?#{(.*?)}/g

function expandOnce(text) {
  var interp = text.replace(regComplex, function(str, esc, code) {
           return esc ? str.slice(1) : '" + (' + code.replace(/\\"/g,'"') + ') + "';      
         })
  if(interp != text) 
    interp = "(" + interp + ")"
  return interp
}
