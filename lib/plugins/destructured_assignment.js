var Token = require("../token");
var stack, results, index

exports.destructured_assignment = function(stream) {  
  stream.each(function() {
    if(!this.assign || !this.prev.rbracket) return
  
    var R = this.prev
    var L = R.matchingBracket
    if(L.expressionStart() == L) {
      stack = []
      results = []
      index = null
      stepInto(L)      
    }

    L.remove(R)
    this.before("_dst")
    this.findClosure().vars["_dst"] = true
    this.next.expressionEnd().after(";\n" + results.join(";\n"))

  })
}

function stepInto(l) {
  if(l.square)  {
    if(index != null)
      stack.push(index)
    stepIntoArray(l)
    index = stack.pop()
    return l.matchingBracket.next
  }
  else if(l.curly) {
    if(index != null)
      stack.push("'" + index + "'")
    stepIntoObject(l)
    stack.pop(index)
    return l.matchingBracket.next
  }  
  else
    throw("unexpected bracket")
}

function stepIntoArray(l) {
  index = 0
  l.next.find(function() {
    if(this == l.matchingBracket) return true
    if(this.op == ",") {
      index += 1
      return
    }
    if(this.lbracket)
      return stepInto(this)
    else {
      results.push(format(this.text, stack.concat(index)))
    }
  })
}

function format(text, stack, index) {
  var t = []
  for(var i=0;i<stack.length;i++) {
    t[i] = "["+ stack[i] + "]"
  }
  return text + " = _dst" + t.join("") 
}

function stepIntoObject(l) {
  index = this.next.text
  l.next.find(function() {
    if(this == l.matchingBracket) return true
    if(this.op == ",") {
      index = this.next.text
      var colon = this.next.next, bracket = colon.next
      if(colon.op == ":") {
        if(bracket.lbracket) 
          return stepInto(bracket)
      }
      return
    }

  })
}