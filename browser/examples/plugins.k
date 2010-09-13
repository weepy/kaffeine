#using

// kaffeine is fully modular and new features can be added via plugins
// for example
// 'using' allows objects methods to be mixed in locally
// great for DSLs

/*
Enum = {
  map: -> etc
  each: -> etc
  filter: -> etc
}
*/

using Enum

// we can now use map, filter etc. in the local scope
B = map([1,2,3], fn)

// The using plugin looks like:
/*
exports.using = function(stream) {
  var operators = {}
  
  stream.each(function() {
    if(this.word && this.text == "using") {
      var end = this.next.find(function() {      
        if(this.next.newline) return true        
      })
      
      var insert = this.prev
      var X = this.remove(end).next.next.collectText()
      var s = 'for(var _u in '+X+')'
      s += '  eval("var " + _u + "='+X+'[\'" + _u + "\'];");'
      insert.after(new Token.word(s))
    }
  })  
}
*/
