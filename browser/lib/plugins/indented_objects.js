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
    var block = this
    var oneLiner = !this.find(function() { if(this.text.match(/\n/)) return true }).operator
    var pair = Token.bracket.pair("{}")     // we need to insert some !
    block.prev.before(pair.L).after(" ");
    
    // this block lifted directly from indented_blocks....
    if(oneLiner)  { 
      block.nextNewline().before(pair.R).before(" ");
  
    } else {

      var cur = block.lastNewline()
      
      var indent = cur.collectText(this.prev).split("\n").pop().length
      var cur = block
      while(cur) {

        if(!cur || cur.indent().length == 0 || cur.indent().length < indent) break
        cur.text += "  "
        cur = cur.next.nextNewline()
      }

      // var indent2 = block.next.nextNewline().indent()
      var len = Math.max(indent - 1, 0);
      var space =new Array(len).join(" ");
      (cur.nextNewline()).before(pair.R).before("\n"+space)
    }

    pair.L.updateBlock()
    return pair.L
  })
}


// end module
})