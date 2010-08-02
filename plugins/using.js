/*
 X


*/
/*
operator << {
  LHS.push(RHS)
}

a["b"] << get(A)
to 
a["b"].push(get(A))
*/

Kaffeine.plugin("using", function(stream) {
  var operators = {}
  
  stream.each(function() {
    if(this.word && this.text == "using") {
      var end = this.next.find(function() {      
        if(this.next.newline) return true        
      })
      
      var insert = this.prev
      var X = this.remove(end).next.next.allText()
      var s = 'for(var _u in '+X+') eval("var " + _u + "='+X+'[\'" + _u + "\'];");'
      insert.after(new Word(s))
    }
  })  
})

