var inherits = function(child, parent) {
  var ctor = function(){ };
  ctor.prototype = parent.prototype;
  child.__superClass__ = parent.prototype;  
  child.prototype = new ctor();
  child.prototype.constructor = child;
  child.fn = child.prototype
};

function base(text) { this.text = text; this.id = base.id++ }
base.id = 0
base.fn = base.prototype
base.klasses = [whitespace, word, string, comment, regex, operator, bracket, semi]

function /*Token*/ize(input) {
  var klass, match, i, index = 0, head, tail
  for(i=0; i< base.klasses.length; i++)
    base.klasses[i].match = undefined

  while(index < input.length) {
    for(i=0; i< base.klasses.length; i++) {
      klass = base.klasses[i]
      match = base.getMatch(klass, index, input)
      if(match) break
    }
    if(match) {
      emit(new klass(match))
      index += match.length
    } else {
      emit(new unknown(input.charAt(index)))
      index += 1 
    }
  }
  
  function emit(token) {
    if(tail)
      tail.after(token),
      tail = token
    else 
      head = tail = token
  }
  head = preprocess(head)
  return head
}

function preprocess(stream) {
  // remove comments & hungry operators & hungry left round brackets  
  stream = stream.each(function() { 
    if(this.comment) {
      if(this.single) {
        //this.text = this.text.replace(/\n$/, "")
        var empty = new whitespace("")//"\n")
      } else {
        var empty = new whitespace("")
      }
            
      empty.comment = this 
      this.replaceWith(empty);
      empty.hungry();
      if(empty.text.match(/\n/)) empty.newline = true // probably should do something neater
      return empty.next
    }
    else if(this.operator) {
      this.hungry()
    }
    else {
       // SHOULD BE HERE ?!!?!
//      if(this.lbracket && this.round && this.prev.whitespace) 
//        this.combine("prev")
//      if(this.lbracket && this.next.whitespace)
//        this.combine("next")
//      if(this.rbracket && this.prev.whitespace)
//        this.combine("prev")
    }
    
  })
  
  // match brackets
  var stack = []
  stream.each(function() { 
    if(this.bracket)  
      if(this.lbracket) 
        stack.push(this)
      else
       this.matchWith(stack.pop())
  })
  
  if(stack.length) throw "unmatching number of brackets" 
  // sort out block types
  stream.each(function() {   
    if(this.curly && this.lbracket) this.updateBlock()
  })
  return stream
}

base.fn.after = function(head) {
  if(typeof head == "string") head = /*Token.*/ize(head)
  tail = head.tail()
  if(this.next) {
    this.next.prev = tail
    tail.next = this.next
  }
  this.next = head
  head.prev = this
  return tail
}

base.fn.before = function(head) {
  if(typeof head == "string") head = /*Token.*/ize(head)
 
  tail = head.tail()
  if(this.prev) {
    this.prev.next = head
    head.prev = this.prev
  }
  this.prev = tail
  tail.next = this
  return head
}

base.fn.head = function() {
  var tok = this
  while(tok.prev) tok = tok.prev
  return tok   
}

base.fn.tail = function() {
  var tok = this
  while(tok.next) tok = tok.next
  return tok
}

base.fn.remove = function(tail) {
  tail = tail || this
  if(tail.next) tail.next.prev = this.prev  
  if(this.prev) this.prev.next = tail.next
  tail.next = null
  this.prev = null
  return this
}

base.fn.replaceWith = function(head) {
  if(typeof head == "string") head = /*Token.*/ize(head)
  var tail = this.after(head)
  this.remove()
  return tail
}

base.fn.combine = function(dir) {
  if(!this[dir]) return 
  var token = this[dir].remove()
  this.o_text = this.o_text || this.text
  this.text = dir == "prev" ? token.text + this.text : this.text + token.text
  
  if(token.newline) this.newline = true
}

base.fn.collectText = function(end) {
  var text = [], token = this, vars
  while(token) {
    if(token.comment) text.push(token.comment.text)
    text.push(token.text)
    if(token.vars) {
      vars = token.declareVariables()
      text.push(vars)
    }
    if(token == end) break
    token = token.next
  }
  return text.join("")
}


base.fn.find = function(fn, skip) {
  var token = this
  var i = 0
  while(token) {
    var result = fn.call(token, token, i++)
    if(result === true) {
      if(!skip) return token
      else skip--
    }
    if(result === false) return null
    token = result ? result : token.next    
  }
}

base.fn.findRev = function(fn, skip) {
  var token = this
  var i = 0
  while(token) {
    var result = fn.call(token, token, i++)
    if(result === true) {
      if(!skip) return token
      else skip--
    }
    if(result === false) return null
    token = result ? result : token.prev
  }
}

base.fn.prevNW = function() {
  return this.prev.findRev(function() {
    if(!this.whitespace) return true
  })
}

base.fn.nextNW = function() {
  return this.next.find(function() {
    if(!this.whitespace) return true
  })
}


  
base.fn.expressionStart = function(breakFn) {
  return this.findRev(function() {
    if(this.rbracket) return this.matchingBracket//.prev
    var x = this.prev
    if(x.whitespace || x.semi || x.assign || (x.lbracket && x.round) || x.comparison) return true
    if(breakFn && breakFn.call(x,x)) return true

  })
}
//if(opts.commas && x.op == ",") return true
//if(opts.operators && x.operator) return true

base.fn.expressionEnd = function(breakFn) {
  return this.find(function() {
    if(this.lbracket) return this.matchingBracket//.next
    var x = this.next
    if(x.whitespace || x.semi || x.assign || (x.rbracket && x.round) || x.comparison) return true
    if(breakFn && breakFn.call(x,x)) return true
  })
}

base.getMatch = function(klass, index, input) {
  if(klass.match === false) return

  if(!klass.match || klass.match.index < index) {  
    klass.match = null
    klass.regex.lastIndex = index
    klass.match = klass.regex.exec(input)
    if(!klass.match) klass.match = false 
  }

  if(klass.match && klass.match.index == index)
    return klass.extract ? klass.extract(index, input) : klass.match[0]
}

base.fn.each = function(fn, dir) {
  var tok = this
  dir = dir || "next"
  while(tok) {
    var result = fn.call(tok, tok)
    if(result === false) break
    last = tok
    tok = result instanceof base ? result : tok[dir] // skip to result if it's a token
  }
  return last.head()
}

base.fn.hungry = function() {
  if(this.prev && this.prev.whitespace)  
    this.combine("prev")
  if(this.next && this.next.whitespace)
    this.combine("next")
}

base.fn.unhungry = function() {
  var left = this.text.match(/^\s*/)[0]
  var right = this.text.match(/\s*$/)[0]
  if(left) {
    this.before(new whitespace(left))
    this.text = this.text.replace(/^\s*/, "")
  }
  if(right) {
    this.after(new whitespace(right))
    this.text = this.text.replace(/\s*$/, "")
  }
  
}

base.fn.findClosure = function() {
  var parent = this.prev.findRev(function(tok) {
    if(tok.rbracket) return tok.matchingBracket.prev // skip behind
    if(tok.blockType == 'function') return true
  })
  return this.parent = parent  //|| this.head() // i,e if not found we're in the global scope
}

base.fn.prevNewline = function(includeThis, skipBrackets) {
  var start = includeThis ? this : this.prev
  var nl = start.findRev(function(tok) {
    if(tok.newline) return true
    if(skipBrackets && tok.rbracket) return tok.matchingBracket.prev // skip behind
  })
  return nl 
} 

base.fn.nextNewline = function(includeThis, skipBrackets) {  
  var start = includeThis ? this : this.next
  var nl = start.find(function(tok) {
    if(tok.newline) return true
    if(skipBrackets && tok.lbracket) return tok.matchingBracket.next // skip over
  })
  return nl
}

base.fn.indent = function() {
  var nl = this.prevNewline("include")
  return nl ? nl.text.split("\n").pop() : ""
}

function unknown(text) { 
  this.text = text
  this.id = base.id++  
}
inherits(unknown, base)
unknown.fn.unknown = true

function whitespace(text) { 
  this.text = text; 
  this.newline = /\n/.test(text);  
  this.id = base.id++ 
}
inherits(whitespace, base)
whitespace.fn.whitespace = true
whitespace.regex = /\s+/g

var keywords = "if for while else try catch function return var".split(" ")

function word(text) { 
  this.text = text
  if(keywords.indexOf(text) >= 0)
    this.keyword = true  
  this.id = base.id++ 
}

inherits(word, base)
word.fn.word = true
word.regex = /[A-Za-z0-9_$]+/g

function string(text) { 
  this.text = text
  this.id = base.id++ 
}
inherits(string, base)
string.fn.string = true
string.regex = /['"]/g

function regex(text) { 
  this.text = text
  this.id = base.id++ 
}
inherits(regex, base)
regex.fn.regex = true
regex.fn.string = true
regex.regex = /\/[^*\/ ][^\n]*\//g

function comment(text) { 
  this.text = text
  this.single = this.text.match(/^\/\//)
  this.id = base.id++ 
}
inherits(comment, base)
comment.fn.comment = true
comment.regex = /\/\*|\/\//g

var comparisonOperators = ["<=","<",">=", ">", "==", "!=", "===", "!==", "||", "&&"]
function operator(text) { 
  this.text = text; 
  this.op = this.text 
  this.assign = /^=$/.test(text)  
  this.comparison = comparisonOperators.indexOf(this.text) >= 0
  this.id = base.id++ 
}
inherits(operator, base)
operator.fn.operator = true
operator.regex = /[!%^&*\-=+:,.|\\~<>\?]+|\/|\/=/g // we dont support operators containing forward slash other than '/' and '/='  (too difficult to compare with // and /*)

function semi(text) { 
  this.text = text
  this.id = base.id++ 
}
inherits(semi, base)
semi.fn.semi = true
semi.regex = /;/g

function bracket(text) { 
  this.text = text 
  this.lbracket = text.match(/[\(\[\{]/)  
  this.rbracket = !this.lbracket
  
  if(text == "{" || text == "}")
    this.curly = true
  else if(text == "(" || text == ")")
    this.round = true
  else if(text == "[" || text == "]")
    this.square = true
  this.id = base.id++ 
}

inherits(bracket, base)
bracket.fn.bracket = true
bracket.regex = /[\(\)\[\]\{\}]/g

bracket.fn.matchWith = function(other) {
  other.matchingBracket = this
  this.matchingBracket = other
}

bracket.pair = function(s) {
  var letters = s.split("")
  var L = new bracket(letters[0]), R = new bracket(letters[1])
  L.matchWith(R)
  return {L:L, R:R}
}

var blockKeywords = "if for while else try catch function".split(" ")

bracket.fn.updateBlock = function() {
  var type = this.prev.findRev(function(token) {
    if(token.whitespace)            return null  // skip whitespace
    else if(token.rbracket)    return token.matchingBracket.prev // skip before matching bracket
    else if(token.word)
      if(blockKeywords.indexOf(token.text) >= 0)
                                    return true  // found it!
      else                          return null  // skip variables
    else                            return false // fail no keyword found
  })

  if(type) {
    this.blockType = type.text
    type.block = this    
  } else {
    this.blockType = "object"
  }

  if(this.blockType == 'function') {
    this.findClosure()
    this.args = this.findArgs()
    this.vars = {}
  }
}

bracket.fn.findArgs = function() {
  if(!this.prev) return {}
  var args = {}
  var prev = this.prev.whitespace ? this.prev.prev : this.prev
  
  if(!prev.matchingBracket) return
  
  var text = prev.matchingBracket.collectText(prev).replace(/[\(\) ]/g, "")
  
  var words = text.split(",")
  
  if(text.length)
    for(var i=0;i<words.length;i++)
      args[words[i]] = true  
  return args
}

bracket.fn.declareVariables = function() {
  var vars = []
  for(var j in this.vars) {
    var text = j
    if(typeof this.vars[j] == "string") 
      text += " = " + this.vars[j]
    vars.push(text)
  }
  if(!vars.length) return ""

  var string = "var " + vars.join(", ") + ";"
  var space = this.global ? "" : "  "
  string = "\n" + space + this.indent() + string // should find current indent really
  return string
}

base.fn.getUnusedVar = function(prefix) {
  var num = 10, name
  prefix = prefix || "_"
  while(true) {
    name = (num).toString(36)
    if(!this.vars[prefix + name])
      break
    num++
  }
  return prefix + name
}

base.fn.cacheExpression = function(name) {
  name = name || "_xpr"
  var pair = bracket.pair("()")
  var closure = this.findClosure()
  closure.vars[name] = true
  this.expressionStart().before(new operator("=")).before(new word(name)).before(pair.L)
  this.expressionEnd().after(pair.R)
}

string.extract = function(index, input) {
  var mode = input.charAt(index), i = index + 1, last
  var word = mode
  while(i < input.length) {
    var ch = input.charAt(i)
    word += ch
    if(ch == mode && last != "\\") return word
    last = ch
    i += 1
  }
}

comment.extract = function(index, input) {
  var comment = "", prev = ""
  var type = input.charAt(index+1)
  while(index < input.length) {
    var ch = input.charAt(index)
    if(type == "/" && ch == "\n") return comment
    if(type == "*" && ch == "/" && prev == "*") 
      return comment + "/"
    comment += ch
    index += 1
    prev = ch
  }
}

regex.extract = function(index, input) {
  var regex = "/", prev = "", esc, inSQ
  while(index < input.length) {
    var ch = input.charAt(index+1)
    regex += ch
    esc = prev == "\\"
    if(ch == "/" && !esc && !inSQ) {
      var next = input.charAt(index+2)
      if(next == "m" || next == "g" || next == "i") regex += next
      return regex
    }
    else if(ch == "[" && !esc) inSQ = true
    else if(ch == "]" && !esc && inSQ) inSQ = false
    index += 1
    prev = ch
  }
}

module.exports = { whitespace: whitespace, operator: operator, string: string, word: word, comment: comment, bracket: bracket, unknown: unknown, semi: semi, ize: ize }