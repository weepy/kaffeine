require.module('./plugins/string_interpolation', function(module, exports, require) {
// start module: plugins/string_interpolation

var Token = require("../token");
module.exports = function(stream) {
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
    
    if(/^".*[#]/.test(this.text)) {
      var ret = this.next
      var string = expandOnce(this.text)
      this.replaceWith(string)
      return ret
    }
    return
  })
  
  // remove double brackets
  stream.each(function() {
    if(this.lbracket && this.round && this.next.lbracket && this.next.round) {
      var n = this.matching.prev
      if(n.rbracket && n.round) {
        this.next.remove()
        n.remove()
      }
    }
  })
    
}

// partially borrowed from visionmedia's Jade
//var regSimple = /(\\)?[$]([A-Za-z0-9.@_]+)/g
var regComplex = /(\\)?#{(.*?)}/g

function expandOnce(text) {
  var changed = false
  var interp = text.replace(regComplex, function(str, esc, code) {
           if(!esc) changed = true 
           return esc ? str.slice(1) : '" + (' + code.replace(/\\"/g,'"') + ') + "';      
         })
  if(changed) 
    interp = "(" + interp + ")"
  
  //interp = interp.replace('"" + ', "")
  interp = interp.replace(' + ""', "")
  return interp
}


// end module: plugins/string_interpolation
});
