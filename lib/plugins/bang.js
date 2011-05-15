
var Token = require("../token");

module.exports = function(stream) {

  stream.each(function(token) {
    Token.current_token = this
    
    if(!token.bang) return    
    
    var lbracket = token.next;
    
    
    
    if(!lbracket || !lbracket.lbracket || !lbracket.round) {

      var pair = Token.bracket.pair("()")
      token.after(pair.L)
      pair.L.after(pair.R)
      lbracket = token.next;
    
    }

    
    var indent = token.indent();
    
    var func = token.expressionStart(function() { if(this.operator && this.text != ".") return true}) // break on operators
    var func_before = func.prev
    

    var rbracket = lbracket.matching
    
    var before_start = func.lineStart ()
    var vars = []
    
    // console.log("before_start", before_start.collectText())

    var fn = token.findClosure()
    var x = fn.asyncBangCount || 0
    var args = "_" + x
    
    if(func_before && func_before.assign) {
      var vars = before_start.collectText(func_before.prev).split(", ")
      var v = []
      for(var i=0;i<vars.length;i++) {
        v.push("_" + (i+x))
      }
      args = v.join(", ")
    }

    // debugger
    var brackets = 0
    var before = null
    
    if(func == before_start) {
      var brackets = 0
    }
    else {
      var before = before_start.remove(func.prev)
    
      before.each(function() {
        if(this.lbracket) brackets++
        if(this.rbracket) brackets--      
      })
      
    }
    
    var start_after_fn = rbracket.next        

    var end_after_fn = start_after_fn.find(function() {
     
      if(this.lbracket) return this.matching.next
      if(this.rbracket) {
        if(brackets == 0) return true
        else brackets--
      }
      if(this.__break) return true

      if(this.next.text == "---") {
        var text = this.next.myText();
        this.next.replaceWith(text.replace("---", "   "))
        this.next.__break = true
      }
      
      // if(this.text == "---") {
      //   var text = this.myText();
      //   this.replaceWith(text.replace("---", "   "))
      //   return true
      // }
    })
    
    var after    
    if(start_after_fn == end_after_fn) {
      // debugger
      // if(!start_after_fn.rbracket ) 
      //         after = start_after_fn.remove(end_after_fn)
      // console.log("start_after_fn", start_after_fn.text)
    } else {
      after = start_after_fn.remove(end_after_fn.prev)      
    }
    
    var before_text = before ? before.collectText() : ""
    

    if(before_text.match(/^[ \n]*$/)) {
      args = ""
      if(before_text) func.before(before_text)
    } 
    
    
    if(lbracket.next == rbracket) {
      num_func_args = 0
    } else {
      var func_args = lbracket.next.collectText(rbracket.prev)
      var num_func_args = func_args.split(",").length
    }


    if(after)
      after.find(function() {
        if(this.was_at_symbol) {
          var ffn = this.findClosure()
          if(!ffn) {
            fn.vars._this = "this"
            this.text = "_this"
          }
        }
      })



    

    if(args == "" && after && !after.myTextNoComments().match(/^[ \n]*$/)) {
      args = "_" + (x); x++
    }
        
    if(vars.length > 1) {
      var a = []
      for(var i=0; i<vars.length ; i++, x++) {
        a.push(vars[i] + " = " + "_" + x)
      }
      before_text = a.join(", ")    
        
    } else {
      x++
      before_text += args 
    }
    
    var funct = before_text + (after ? after.collectText() : "")
    
    var body = Token.ize("function(" + (args) + ") { " + funct + " }")
    
    
    if(num_func_args > 0) rbracket.before(", ")

    rbracket.before(body)

    token.text = token.text.replace(/!/,"")
    
    body.next.matching.nextNW().updateBlock()  // implicit vars etc

    body.block.asyncBangCount = x
    // func.before(indent)
  })
}

// var Token = require("../token");
// 
// module.exports = function(stream) {
//   stream.each(function(token) {
// 
//     if(!token.bang) return    
//     
//     var lbracket = token.next
//     
//     var func = token.expressionStart()
//     
//     var indent = token.indent()
//     
//     var vars = ""
//     if(func.prev.assign) {
//       var e = func.prev.prev
//       var s = e.expressionStart()
//       vars = s.remove(e).collectText()
//       func.prev.remove()
//     }
//     
//     var rbracket = lbracket.matching
//     
//     var start_fn = rbracket.next
//     var end_fn = start_fn.find(function() {
//       if(this.lbracket) return this.matching.next
//       if(this.rbracket) return true
//     })
//     
//     var body = start_fn.remove(end_fn.prev)
//     
//     var fn = this.findClosure()
//     body.find(function() {
//       if(this.was_at_symbol) {
//         var ffn = this.findClosure()
//         if(!ffn) {
//           fn.vars._this = "this"
//           this.text = "_this"
//         }
//       }
//     })
//     
//     body = body.collectText()
//     var endsWithNL = body.match(/\n *$/)
//     body = body.replace(/\n/g, "\n  ")
//     // if(!body.match(/\n$/))
//     //       body += "\n"
//     //     body += indent
//     body += " "
//     
//     body = body.replace(/\s*\n( *)$/, function(a, b) { 
//       return "\n" + b;
//     })
//     
// 
//     if(!endsWithNL)
//       body = body.replace(/\n *$/, " ") 
//     var text = "function(" + vars + ") {"  + body + "}"
//     
//     if(lbracket.next != rbracket)
//       text = ", " + text
//     
//     var tokens = Token.ize(text)
//     tokens.banged_function = true
//     
//     rbracket.before(tokens)
//     // if(!rbracket.next.newline)
//     //   rbracket.after("\n")
//     //token.bang = false
//     token.text = token.text.slice(0,token.text.length-1)
//     return token.next
//   })
// }
