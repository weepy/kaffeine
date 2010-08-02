Kaffeine.plugin("reverse_ifs", function(stream) {
  stream.each(function() {
    if(this.keyword && this.text == "if" && !this.prev.newline) { 
      var newline = this.findRev(function() { if(this.newline ) return true })
      var end = this.prev
      var expr = newline.next.remove(end)      
      this.next.matchingBracket.after(new Word(" ")).after(expr)
      return 
    }
  })
})
