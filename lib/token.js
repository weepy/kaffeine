var log = console.log

var inherits = function(child, parent) {
  var ctor = function(){ };
  ctor.prototype = parent.prototype;
  child.__super__ = parent.prototype;  
  child.prototype = new ctor();
  child.prototype.constructor = child;
  child.fn = child.prototype
};

function base(text) { 
  this.text = text; 
  this.id = base.id++;
  this.eaten = {left:[], right:[]}
}

base.id = 0
base.fn = base.prototype
base.klasses = [whitespace, comment, regex, operator, word, string, bracket, semi]

function preprocess(text) {
  text = text.replace(/\t/g, "  ").replace(/ *\n/g, "\n").replace(/\r\n|\r/g,"") 
  return text
}

function /*Token*/ize(input) {
  // /sconsole.log(input)
  input = preprocess(input)
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
    
    //log(token.klass, ": ", token.text)    
    
    if(tail) {
      tail.next = token
      token.prev = tail
      tail = token
    }
    else 
      head = tail = token
  }
  head = postprocess(head)
  return head
}

function postprocess(stream) {
  
  // match brackets
  var stack = []
  stream.each(function() { 
    if(this.bracket)  
      if(this.lbracket) 
        stack.push(this)
      else
       this.matchWith(stack.pop())
  })
  
  if(stack.length)
    throw "unmatching number of brackets" 
  // sort out block types
  stream.each(function() {   
    if(this.curly && this.lbracket) this.updateBlock()
  })
  
    // remove comments & hungry operators & hungry left round brackets  
  stream.normalize()
  return stream
}

// normalize is at the start and run after ever plugin
// it ensures various assumptions are true ...
base.fn.normalize = function() {
  this.each(function() {
    var next = this.next    
  
    // there are never 2 space tokens next to each other
    if(this.next && this.next.whitespace && ["for"].indexOf(this.text) >= 0 ) {
      this.eatRight()
    }
    
    if(this.space) {
      if(next && next.space) {
        this.eatRight(function() { return this.space })
      }
    } 
    else if(this.comment) {
      // comments are eaten by their next..
      next.eatLeft()
      return next.prev    
    }
    else if(this.operator) {
      // operators are never adjacent to whitespace 
      this.eat(function() { return this.whitespace })
      this.eat(function() { return this.whitespace })
    }

    else {
      // brackets next have previous whitespace
      if(this.rbracket && this.prev.whitespace && !this.matching.global)
        this.eatLeft()

    }
  })
  
  // now let's assign code blocks to keywords without {}'s
  this.each(function() {
    this.addImpliedBraces()
  })
}

base.fn.addImpliedBraces = function() {
 
  if(this.block || ["do", "if", "for", "while", "try", "else", "catch"].indexOf(this.text) < 0) return
  
  var closingBracket = this.next.matching
  // require's brackets
  if(!closingBracket) return

  function end(tok) {
    if(tok.block) return tok.block.matching
    if(["if", "for", "while", "try", "else", "catch"].indexOf(tok.text) >= 0)
      return end(tok.next.matching.nextNW())
    return tok.find(function() {
      if(this.lbracket) return this.matching
      if(this.next.newline) return true
      if(this.next.rbracket && this.next.curly) return true
    })
  }
    
  var pair = bracket.pair("{}")
  pair.L.implied = true
  pair.R.implied = true
  
  var next = closingBracket.nextNW()

  end(next).after(pair.R)
  closingBracket.after(" ").after(pair.L)
  
  var indent = this.indent()
  
  pair.R.before(" ")
  //pair.R.before(pair.L.next.newline ? "\n" + indent : " ")  
  pair.L.updateBlock()
  pair.L.eatLeft()
  pair.R.eatLeft()
  if(pair.R.prev.whitespace)
    pair.R.eatLeft()
  return 
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

base.fn.append = function(tokens) {
  if(typeof tokens == "string") tokens = /*Token*/ize(tokens)
  var tail = this.tail()
  tail.next = tokens
  tokens.prev = tail
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


  
base.fn.lineStart = function(breakFn) {
  var s = this.findRev(function() {
    var x = this

    if(this.rbracket) return this.matching
    x = x.prev
    y = x.prev
    
    if(x.lbracket && x.curly && x.blockType != "object") {
      return true
    }
    // if(x.assign) return true
    if(x.semi) {
      return true
    }
    if(x.whitespace) {
      if(y.word) return true
      if(y.rbracket) return true
      // if(y.whitespace) return true
    }
    
    
    // if(breakFn && breakFn.call(x,x)) return true
  })
  
  if(s.whitespace) s = s.nextNW()
  return s
}
base.fn.expressionStart = function(breakFn) {
  return this.findRev(function() {
    var x = this
    if(this.rbracket) return this.matching
    x = x.prev
    if(x.whitespace || x.semi || x.assign || x.lbracket) return true // || x.comparison
    if(breakFn && breakFn.call(x,x)) return true

  })
}


base.fn.expressionEnd = function(breakFn) {
  return this.find(function() {
    if(this.lbracket) return this.matching
    if(this.block) return this.block
    var x = this.next
    if(x.whitespace || x.semi || x.assign || (x.rbracket )) return true // || x.comparison
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

base.fn.eat = function(test) {
  this.eatLeft(test)
  this.eatRight(test)
}

base.fn.eatLeft = function(test) {
  var token = this.prev  
  if(token && (!test || test.call(token))) {
    token.remove()
    this.eaten.left.unshift(token)
    this.newline = this.myText().match(/\n/) 
  }
}

base.fn.eatRight = function(test) {
  var token = this.next  
  if(token && (!test || test.call(token))) {
    token.remove()
    this.eaten.right.push(token)
    this.newline = this.myText().match(/\n/)
  }
}

base.fn.spit = function(test) {
  this.spitLeft(test)
  this.spitRight(test)
}

base.fn.spitLeft = function(test) {
  var token = this.eaten.left.shift()
  if(token && (!test || test.call(token))) {
    this.before(token)
    this.newline = this.myText().match(/\n/)
  }
  return token
}

base.fn.spitRight = function(test) {
  var token = this.eaten.right.pop()
  if(token && (!test || test.call(token))) {
    this.after(token)
    this.newline = this.myText().match(/\n/)
  }
  return token
}


base.fn.myTextNoComments = function() {
  return this.comment ? "" : this.myText()
}

base.fn.myLeftEatenText = function() {
  var text = ""
  for(var i=0; i<this.eaten.left.length; i++)
    text += this.eaten.left[i].myText()
    
  return text
}

base.fn.myRightEatenText = function() {
  var text = ""
  for(var i=0; i<this.eaten.right.length; i++)
    text += this.eaten.right[i].myText()
  return text
}

base.fn.myText = function() {
  var text = [], vars
  if(this.implied) return ""
  

  text.push(this.myLeftEatenText())
  text.push(this.text)
  

  text.push(this.myRightEatenText())

  return text.join("")
}

base.fn.collectText = function(end) {
  var text = [], token = this
  while(token) {
    text.push(token.myText())
    if(token == end) break
    token = token.next
  }
  return text.join("")
}

base.fn.collectTextNoComments = function(end) {
  var text = [], token = this
  while(token) {
    text.push(token.myTextNoComments())
    if(token == end) break
    token = token.next
  }
  return text.join("")
}



base.fn.findClosure = function() {
  var parent = this.prev.findRev(function(tok) {
    if(tok.rbracket) return tok.matching.prev // skip behind
    if(tok.blockType == 'function') return true
  })
  this.parent = parent  //|| this.head() // i,e if not found we're in the global scope
  return this.parent
}

base.fn.prevNewline = function(includeThis, skipBrackets) {
  var start = includeThis ? this : this.prev
  var nl = start.findRev(function(tok) {
    if(tok.newline) return true
    if(skipBrackets && tok.rbracket) return tok.matching.prev // skip behind
  })
  return nl 
} 

base.fn.nextNewline = function(includeThis, skipBrackets) {  
  var start = includeThis ? this : this.next
  var nl = start.find(function(tok) {
    if(tok.newline) return true
    if(skipBrackets && tok.lbracket) return tok.matching.next // skip over
  })
  return nl
}

base.fn.nextNewlineOrRbracket = function() {  
  return this.next.find(function(tok) {
    if(tok.rbracket) return true
    if(tok.newline) return true
    if(tok.lbracket) return tok.matching.next // skip over
  })
}

base.fn.followingWhitespaceWithNewline = function() {
  return this.next.find(function() {
    if(this.newline) return true
    if(this.whitespace) return null
    return false
  })
}


base.fn.indent = function() {
  var nl = this.prevNewline("include")
  if(!nl) return ""
  //return nl.next.whitespace ? nl.next : ""
   var text = nl.next.myText()
   var match = text.match(/^( *)/)
   return match ? match[1] : ""
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


function unknown(text) { 
  base.call(this, text)
}
inherits(unknown, base)
unknown.fn.unknown = true
unknown.fn.klass = "unknown"

function whitespace(text) { 
  base.call(this, text)
  this.newline = /\n/.test(text);  
  this.space = !this.newline
}
inherits(whitespace, base)
whitespace.fn.whitespace = true
whitespace.fn.klass = "whitespace"
whitespace.regex = / +|\n/g



var keywords = "if do for while else try catch function return var".split(" ")

function word(text) { 
  base.call(this, text)
  if(keywords.indexOf(text) >= 0)
    this.keyword = true
  
  if(text.match(/!$/))
    this.bang = true
}

inherits(word, base)
word.fn.word = true
word.regex = /[A-Za-z0-9_$]+!?/g
word.fn.klass = "word"

function string(text) { 
  base.call(this, text)
}
inherits(string, base)
string.fn.string = true
string.regex = /['"]/g
string.fn.klass = "string"

function regex(text) { 
  base.call(this, text)
}
inherits(regex, base)
regex.fn.regex = true
regex.fn.string = true
regex.regex = /\/[^*/ ][^/\n]*\//g ///\/[^/ ][^\n]*\//g
regex.fn.klass = "regex"

function comment(text) { 
  base.call(this, text)
  this.single = this.text.match(/^\/\//)
}
inherits(comment, base)
comment.fn.comment = true
comment.regex = /\/\*|\/\//g
comment.fn.klass = "comment"

var comparisonOperators = ["<=","<",">=", ">", "==", "!=", "===", "!==", "||", "&&"]
var unaryOperators = ["++", "--", "!", "~", "&", "|"]

function operator(text) { 
  base.call(this, text)
  //this.op = this.text 
  this.assign = /^=$/.test(text)  
  this.comparison = comparisonOperators.indexOf(this.text) >= 0
  this.unary_operator = unaryOperators.indexOf(this.text) >= 0
}
inherits(operator, base)
operator.fn.operator = true
operator.regex = /instanceof|[!%^&*\-=+:,.|\\~<>\?]+|\/|\/=/g 
operator.fn.klass = "operator"
// we dont support operators containing forward slash other than '/' and '/='  (too difficult to compare with // and /*)

function semi(text) { 
  base.call(this, text)
}
inherits(semi, base)
semi.fn.semi = true
semi.regex = /;/g
semi.fn.klass ="semi"

function bracket(text) { 
  base.call(this, text)
  this.lbracket = text.match(/[\(\[\{]/)  
  this.rbracket = !this.lbracket
  
  if(text == "{" || text == "}")
    this.curly = true
  else if(text == "(" || text == ")")
    this.round = true
  else if(text == "[" || text == "]")
    this.square = true
}

inherits(bracket, base)
bracket.fn.bracket = true
bracket.regex = /[\(\)\[\]\{\}]/g
bracket.fn.klass = "bracket"

bracket.fn.matchWith = function(other) {
  other.matching = this
  this.matching = other
}

bracket.pair = function(s) {
  var letters = s.split("")
  var L = new bracket(letters[0]), R = new bracket(letters[1])
  L.matchWith(R)
  return {L:L, R:R}
}

var blockKeywords = "do if for while else try catch function".split(" ")




bracket.fn.updateBlock = function() {

  var state = {
    bracket: false,
    name: false
  }
  var type
  
  if(this.prev) {
    type = this.prev.findRev(function(token) {
      if(token.whitespace)            return null  // skip whitespace
      else if(token.rbracket && token.rbracket) {
        state.bracket = token.matching
        return token.matching.prev // skip before matching bracket
      }   
      else if(token.word) {
        if(blockKeywords.indexOf(token.text) >= 0)
          return true  // found it!
        else if(!state.name) {
          state.name = token
          return null  // skip variables
        }
        else return false 
      }
      else return false // fail no keyword found
    })
  }
  
  if(type) {
    this.blockType = type.text
    this.blockTypeNode = type
    type.block = this
    type.namedFunction = state.name
    type.bracketExpression = state.bracket
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
  
  if(!prev.matching) return
  
  var text = prev.matching.collectText(prev).replace(/[\(\) ]/g, "")
  
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
  
  var string = "var " + vars.join(", ") + "; "
  var space = this.global ? "" : " "
  string = string // should find current indent really
  return string
}

string.extract = function(index, input) {
  var mode = input.charAt(index), i = index + 1, last
  var word = mode
  var backslash_in_a_row = 0
  while(i < input.length) {
     if(last == "\\")
        backslash_in_a_row++
      else
        backslash_in_a_row = 0
    var esc = backslash_in_a_row % 2
    var ch = input.charAt(i)
    word += ch
    if(ch == mode && !esc) return word
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
  
  var regex = "/", prev = "", esc, inSQ, start = index
  var backslash_in_a_row = 0
  while(index < input.length) {
    var ch = input.charAt(index+1)
    regex += ch
    if(prev == "\\")
      backslash_in_a_row++
    else
      backslash_in_a_row = 0
    esc = backslash_in_a_row % 2 
    
    //console.log(ch, esc, backslash_in_a_row)
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

module.exports = { 
  whitespace: whitespace, 
  operator: operator, 
  string: string, 
  word: word, 
  regex: regex,
  comment: comment, 
  bracket: bracket, 
  unknown: unknown, 
  semi: semi, 
  ize: ize, 
  postprocess: postprocess, 
  base: base
}
