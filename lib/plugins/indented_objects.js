var Token = require("../token");

exports.indented_objects = function(stream) {
  stream.each(function() {
    if(this.text != ":") return
    var colon = this
    var key = colon.prev
    if(!key.word && !key.string) return
    var prev = key.prevNW()
    if(prev.lbracket && prev.curly && prev.blockType == "object") {
      addMissingCommas(prev)
      return
    }
    if(prev.text == ",") return
    
    // TODO ignore ternary statements ...
    var baseIndent = colon.prevNewline().next.collectText(key.prev).length
    var start = colon.nextNewlineOrRbracket()
    var cur = start 
    var last = null
    while(cur) {
      if(cur.rbracket) 
        break
      
      var indent = cur.next.indent().length
      if(indent == 0 || indent < baseIndent) break
      cur.next.text += "  "
      
      last = cur
      cur = cur.nextNewlineOrRbracket()
    }
    cur = cur || last
    
    var pair = Token.bracket.pair("{}")
    pair.R.eaten.left.push(Token.ize(" "));
    cur.before(pair.R)
    key.before(pair.L).after(" ");
    pair.L.updateBlock()
    return pair.L
        
  })
}
  
// exports.indented_objects = function(stream) {
// 
//   stream.each(function() {
//     if(this.op != ":") return 
//     if(!this.prev.word || this.string) return
//     
//     var prev = this.prev.prevNW()
//     
//     if(prev.lbracket && prev.curly && prev.blockType == "object") {
//       addMissingCommas(prev)
//       return
//     }
//     if(prev.op == ",") return
//     
//     // need to look for ternary statements too 
//     var start = this.expressionStart(function() { return this.op == "?"})
//     if(start.prev.op == "?") return
//     var colon = this
//     var pair = Token.bracket.pair("{}")     // we need to insert some !
//   
//     var indent = colon.prevNewline().next.collectText(colon.prev.prev).length
//     var start = colon.nextNewline("include")
//     var cur = start
//     while(cur && cur.next) {
//       if(cur.next && cur.next.matchingBracket && cur.next.lbracket) {
//         cur = cur.next.matchingBracket;
//         continue
//       }
//         
//       var curIndent = cur.next.indent().length
// 
//       if(!cur ||  curIndent == 0 || curIndent < indent) break
//       //var  = cur.nextNewline()
//       cur.eaten.right.push(new Token.whitespace("  "))
//             
//       var nextnl = cur.next.find(function(token) {
//         if(token.rbracket) return true
//         if(token.lbracket) return token.matchingBracket.next
//         if(token.newline) return true
//       })
//       
//       if(!nextnl.next)
//         break
//       cur = nextnl
//     }
// 
//     var len = Math.max(indent + 1, 0);
//     var space = (start != cur) ? "\n" + new Array(len).join(" ") : " ";
//     
//     if(!cur.whitespace) {
//       cur.spitLeft()
//       cur.after(pair.R).after(space)
//     }
//     else 
//       cur.before(pair.R).before(space)
//   
//     
//     var x = colon.prev.prev
//     if(x.newline) {
//       x.spit(function() { return this.whitespace})
//       x.after(" ").after(pair.L)
//       x.eat(function() { return this.whitespace})
//       colon.prev.before("  ")
//     } else
//       colon.prev.before(pair.L).after(" ");
//     
//     pair.L.updateBlock()
//     //pair.L.prev.text = pair.L.prev.text.replace(/  $/, "")
//     //addMissingCommas(pair.L)
//     return pair.L
//   })
// }

function addMissingCommas(L) {
  var R = L.matchingBracket
  var end = L.next.find(function() {
    if(this == R) return true
    if(this.lbracket) return this.matchingBracket.next // skip over
    
    if(this.newline && !this.operator && this.nextNW() != R && this.prevNW()  != L) {
      var comma = new Token.operator(",")
      this.before(comma)
      comma.eat(function() { return this.whitespace})
      return comma.next
    }
  })
}
