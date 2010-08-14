require.module('./plugins/indented_objects', function(exports, require) {
// start module 

exports.indented_objects = function(stream, Token) {

  stream.each(function() {
    if(this.op != ":") return 
    if(!this.prev.word || this.string) return
    
    var prev = this.prev.prevNW()
    
    if(prev.lbracket && prev.curly) return
    if(prev.op == ",") return
    
    // need to look for ternary statements too 
    var start = this.expressionStart(function() { return this.op == "?"})
    if(start.prev.op == "?") return
    var colon = this
    var oneLiner = !this.find(function() { if(this.text.match(/\n/)) return true }).operator
    var pair = Token.bracket.pair("{}")     // we need to insert some !
    
    
    if(oneLiner)  { 
      colon.prev.nextNewline().before(pair.R).before(" ");
    } else {

      var indent = colon.prevNewline().collectText(colon.prev.prev).split("\n").pop().length
      var cur = colon.nextNewline("include")
      
      while(cur) {
        var curIndent = cur.next.indent().length
        if(!cur ||  curIndent == 0 || curIndent < indent) break
        cur.text += "  "
        cur = cur.nextNewline()
      }

      var len = Math.max(indent + 1, 0);
      var space =new Array(len).join(" ");
      (cur).before(pair.R).before("\n"+space)
    }
    
    colon.prev.before(pair.L).after(" ");
    
    pair.L.updateBlock()
    pair.L.prev.text = pair.L.prev.text.replace(/  $/, "")
    return pair.L
  })
}


// end module
})