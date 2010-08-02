var inherits = function(child, parent) {
  var ctor = function(){ };
  ctor.prototype = parent.prototype;
  child.__superClass__ = parent.prototype;  
  child.prototype = new ctor();
  child.prototype.constructor = child;
  child.fn = child.prototype
};

function Token(text) { this.text = text; }

Token.fn = Token.prototype

Token.fn.after = function(head) {
  tail = head.tail()
  if(this.next) {
    this.next.prev = tail
    tail.next = this.next
  }
  this.next = head
  head.prev = this
  return tail
}

Token.fn.before = function(head) {
  tail = head.tail()
  if(this.prev) {
    this.prev.next = head
    head.prev = this.prev
  }
  this.prev = tail
  tail.next = this
  return head
}

Token.fn.head = function() {
  var tok = this
  while(tok.prev) tok = tok.prev
  return tok   
}

Token.fn.tail = function() {
  var tok = this
  while(tok.next) tok = tok.next
  return tok
}

Token.fn.remove = function(tail) {
  tail = tail || this
  
  if(tail.next) tail.next.prev = this.prev
  
  if(this.prev) this.prev.next = tail.next
  
  tail.next = null
  this.prev = null
  return this
}

Token.fn.replaceWith = function(head) {
  var tail = this.after(head)
  this.remove()
  return tail
}

Token.fn.combine = function(dir) {
  if(!this[dir]) return 
  var token = this[dir].remove()
  this.o_text = this.o_text || this.text
  this.text = dir == "prev" ? token.text + this.text : this.text + token.text
}

Token.fn.allText = function() {
  var text = [], token = this
  while(token) {
    if(token.Comment) text.push(token.Comment.text)
    text.push(token.text)
    token = token.next
  }
  return text.join("")
}

Token.fn.find = function(fn, skip) {
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

Token.fn.findRev = function(fn, skip) {
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

Token.fn.expressionStart = function() {
  return this.findRev(function() {
    var p = this.prev
    if(p.rbacket) return p.matchingBracket.prev
    if(p.whitespace || p.semi || p.assign || (p.lbracket && p.round) ) return true
  })
}

Token.fn.expressionEnd = function() {
  return this.find(function() {
    if(this.next.whitespace) return true
  })
}


Token.getMatch = function(klass, index, input) {
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


Token.klasses = [Whitespace, Word, StringToken, Comment, Operator, Bracket, Semi]

Token.ize = function(input) {
  var klass, match, i, index = 0, head, tail

  for(i=0; i< Token.klasses.length; i++)
    Token.klasses[i].match = undefined

  while(index < input.length) {
    for(i=0; i< Token.klasses.length; i++) {
      klass = Token.klasses[i]
      match = Token.getMatch(klass, index, input)
      if(match) break
    }
    if(match) {
      emit(new klass(match))
      index += match.length
    } else {
      emit(new UnknownToken(input.charAt(index)))
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
  
  head = Token.preprocess(head)
  return head
}

Token.fn.each = function(fn, dir) {
  var tok = this, dir = "next"
  while(tok) {
    var result = fn.call(tok, tok)
    if(result === false) break
    tok = (result || tok)[dir] // skip to result if it's a token
  }
}

Token.fn.hungry = function() {
  if(this.prev && this.prev.whitespace)  
    this.combine("prev")
  if(this.next && this.next.whitespace)
    this.combine("next")
}

Token.fn.findClosure = function() {
  var parent = this.prev.findRev(function(tok) {
    if(tok.rbracket) return tok.matchingBracket.prev // skip behind
    if(tok.block == 'function') return true
  }) 
  
  return this.parent = parent || this.head() // i,e if not found we're in the global scope
}


Token.fn.lastNewline = function() {
  var nl = this.findRev(function(tok) {
    if(tok.newline) return true
    if(tok.rbracket) return tok.matchingBracket.prev // skip behind
  })
  return nl
}

Token.fn.nextNewline = function() {
  var nl = this.find(function(tok) {
    if(tok.newline) return true
    if(tok.lbracket) return tok.matchingBracket.next // skip behind
  })
  return nl
}

Token.fn.indent = function() {
  return this.lastNewline().text.split("\n").pop().length
}

Token.preprocess = function(stream) {
  // remove comments & hungry operators & hungry left round brackets 
  stream.each(function() { 
    if(this.comment) {
      var empty = new Whitespace("")
      empty.Comment = this 
      this.replaceWith(empty);
      empty.hungry();
      return empty
    }
    else 
    if(this.operator) {
      this.hungry()
    }
    else
    if(this.lbracket && this.round)
      this.hungry()
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
  
  if(stack.length) 
    throw "unmatching number of brackets"
 
  // sort out block types
  stream.each(function() {   
    if(this.curly) this.updateBlock()
  })

  return stream
}


function UnknownToken(text) { this.text = text; }
inherits(UnknownToken, Token)
UnknownToken.fn.unknown = true

function Whitespace(text) { 
  this.text = text; 
  this.newline = /\n/.test(text);  
}
inherits(Whitespace, Token)
Whitespace.fn.whitespace = true
Whitespace.regex = /\s+/g

var keywords = "if for while else try catch function return var".split(" ")
var block_keywords = "if for while else try catch function".split(" ")

function Word(text) { 
  this.text = text; 
  if(keywords.indexOf(text) >= 0)
    this.keyword = true  
}

inherits(Word, Token)
Word.fn.word = true
Word.regex = /[A-Za-z0-9_$]+/g

function StringToken(text) { this.text = text;  }
inherits(StringToken, Token)
StringToken.fn.string = true
StringToken.regex = /['"]/g

function Comment(text) { this.text = text; }
inherits(Comment, Token)
Comment.fn.comment = true
Comment.regex = /\/\*|\/\//g

function Operator(text) { 
  this.text = text; 
  this.op = this.text 
  this.assign = /^=$/.test(text)  
}
inherits(Operator, Token)
Operator.fn.operator = true
Operator.regex = /[!%^&*\-=+:,.|\\\/~<>]+/g

function Semi(text) { 
  this.text = text;  
}
inherits(Semi, Token)
Semi.fn.semi = true
Semi.regex = /;/g

function Bracket(text) { 
  this.text = text 
  this.lbracket = text.match(/[\(\[\{]/)  
  this.rbracket = !this.lbracket
  
  if(text == "{" || text == "}")
    this.curly = true
  else if(text == "(" || text == ")")
    this.round = true
  else if(text == "[" || text == "]")
    this.square = true
 
}

inherits(Bracket, Token)
Bracket.fn.bracket = true
Bracket.regex = /[\(\)\[\]\{\}]/g

Bracket.fn.matchWith = function(other) {
  other.matchingBracket = this
  this.matchingBracket = other
}

Bracket.pair = function(s) {
  var letters = s.split("")
  var L = new Bracket(letters[0]), R = new Bracket(letters[1])
  L.matchWith(R)
  return {L:L, R:R}
}

var blockKeywords = "if for while else try catch function".split(" ")

Bracket.fn.updateBlock = function() {
  var type = this.prev.findRev(function(token) {
    if(token.whitespace)            return null  // skip whitespace
    else if(token.rbracket)    return token.matchingBracket.prev // skip before matching bracket
    else if(token.word)
      if(blockKeywords.indexOf(token.text) >= 0)
                                    return true  // found it!
      else                          return null  // skip variables
    else                            return false // fail no keyword found
  })
  this.block = type ? type.text : "object"  
  if(this.block == 'function') this.findClosure()
}

StringToken.extract = function(index, input) {
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

Comment.extract = function(index, input) {
  var comment = ""   
  while(index < input.length) {
    var ch = input.charAt(index)
    if(ch == "\n") return comment
    comment += ch
    index += 1
  }
}
