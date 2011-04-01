// Kaffeine for the browser. Include this file _after_ all your external Kaffeine scripts.
// Internal Kaffeine scripts will be loaded on document load// Brequire - CommonJS support for the browser
function require(path) {
  var module = require.modules[path];
  if(!module) {
    throw("couldn't find module for: " + path);
  }
  if(!module.exports) {
    module.exports = {};
    module.call(module.exports, module, module.exports, require.bind(path));
  }
  return module.exports;
}

require.modules = {};

require.bind = function(path) {
  var cwd = path.replace(/[^\/]*$/,"");
  return function(p) {
    p = (cwd + p).replace(/\/\.\//, "/").replace(/[^\/]*\/\.\./,"").replace(/\/\//,"/");
    return require(p);
  };
};

require.module = function(path, fn) {
  require.modules[path] = fn;
};
require.module('./token', function(module, exports, require) {
// start module: token

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
base.klasses = [whitespace, word, string, comment, regex, operator, bracket, semi]

function preprocess(text) {
  text = text.replace(/\t/g, "  ").replace(/ *\n/g, "\n").replace(/\r\n|\r/g,"") 
  return text
}

function /*Token*/ize(input) {
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
 
  if(this.block || ["if", "for", "while", "try", "else", "catch"].indexOf(this.text) < 0) return
  
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
  return this.findRev(function() {
    var x = this
    if(this.rbracket) return this.matching
    x = x.prev
    if(x.lbracket && x.curly && this.blockType != "object") return true
    if(x.whitespace || x.semi) return true
    // if(breakFn && breakFn.call(x,x)) return true
  })
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

base.fn.myText = function() {
  var text = [], vars
  if(this.implied) return ""
  
  for(var i=0; i<this.eaten.left.length; i++)
    text.push(this.eaten.left[i].myText())
      
  text.push(this.text)

  if(this.vars) {
    vars = this.declareVariables()
    this.nextNW().before(new word(vars))
    //text.push(vars)
  }
  for(var i=0; i<this.eaten.right.length; i++)
    text.push(this.eaten.right[i].myText())
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

function whitespace(text) { 
  base.call(this, text)
  this.newline = /\n/.test(text);  
  this.space = !this.newline
}
inherits(whitespace, base)
whitespace.fn.whitespace = true
whitespace.regex = / +|\n/g



var keywords = "if for while else try catch function return var".split(" ")

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

function string(text) { 
  base.call(this, text)
}
inherits(string, base)
string.fn.string = true
string.regex = /['"]/g

function regex(text) { 
  base.call(this, text)
}
inherits(regex, base)
regex.fn.regex = true
regex.fn.string = true
regex.regex = /\/[^*\/ ][^\n]*\//g

function comment(text) { 
  base.call(this, text)
  this.single = this.text.match(/^\/\//)
}
inherits(comment, base)
comment.fn.comment = true
comment.regex = /\/\*|\/\//g

var comparisonOperators = ["<=","<",">=", ">", "==", "!=", "===", "!==", "||", "&&"]
function operator(text) { 
  base.call(this, text)
  //this.op = this.text 
  this.assign = /^=$/.test(text)  
  this.comparison = comparisonOperators.indexOf(this.text) >= 0
}
inherits(operator, base)
operator.fn.operator = true
operator.regex = /[!%^&*\-=+:,.|\\~<>\?]+|\/|\/=/g 
// we dont support operators containing forward slash other than '/' and '/='  (too difficult to compare with // and /*)

function semi(text) { 
  base.call(this, text)
}
inherits(semi, base)
semi.fn.semi = true
semi.regex = /;/g

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

var blockKeywords = "if for while else try catch function".split(" ")




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

module.exports = { 
  whitespace: whitespace, 
  operator: operator, 
  string: string, 
  word: word, 
  comment: comment, 
  bracket: bracket, 
  unknown: unknown, 
  semi: semi, 
  ize: ize, 
  postprocess: postprocess, 
  base: base
}


// end module: token
});

require.module('./kaffeine', function(module, exports, require) {
// start module: kaffeine

var Token = require("./token")

function Kaffeine(options) {
  this.options = options;
}

Kaffeine.fn = Kaffeine.prototype;
Kaffeine.VERSION = "0.0.4";
Kaffeine.plugins = {};

//unless brackets_for_keywords reverse_blocks indented_blocks

var defaultDirective = "multiline_strings string_interpolation hash at brackets_for_keywords operators prototype implicit_functions extend_for pre_pipe implicit_brackets implicit_return pipe bang default_args implicit_vars"

Kaffeine.fn.compile = function(text, o) {
  if(!text.match(/\n$/)) text += "\n"; // trailing newline
  var directive = text.match(/^#\s*([^\n]*)\s*\n/) || [1,defaultDirective];
  var plugins = directive[1].replace(/\s+/g," ").replace(/ $/,"").split(" ");
  text = text.slice(directive[0].length);
  var ret =  this.runPlugins(text, plugins);
  
  o = o || {}
  if(o.brequire_module) {
    ret =  "require.module('" + o.brequire_module + "', function(module, exports, require) { \n" + ret + "\n});\n"
  }
  // if(validate)
  //   ret = this.validate(ret)
  return ret
};

Kaffeine.fn.runPlugins = function(text, plugins, options) {
  text = "function(){ " + text + "\n}"; // wrap in closure so we have a global closure and also no problems with start and end of text
  var stream = Token.ize(text);
  //stream = Token.postprocess(stream);
  
  this.currentStream = stream
  
  stream.global = stream.find(function() { 
    if(this.curly) {
      return true;
    }
  });
  stream.global.global = true;

  options = options || {};
  
  for(var i=0; i<plugins.length; i++) {
    var name = plugins[i];
    var plugin = require("./plugins/"+name) //Kaffeine.plugins[name];
    if(!plugin) {
      throw(name + " - not loaded");
    }
    try {
      plugin.call(this, stream, Token, options[name] || {});     
      //stream.normalize() 
    } 
    catch(err) {
      err.plugin = name
      throw(err)
    }
  }
  return stream.head().collectText().replace(/^function\(\)\{/,"").replace(/\n\}$/,"");
};

Kaffeine.fn.validate = function(text) {
  try { 
    new Function(text)
  }
  catch (err) {
    err.invalidJS = true
    throw(err);
  }
  return text
}


//Kaffeine.plugins[p] = require("./plugins/"+p)[p]

if(require.extensions) {
  require.extensions['.k'] = function(module, filename) {
    var fs = require('fs'),
        input = fs.readFileSync(filename, 'utf8'),
        content = (new Kaffeine()).compile(input)
    module.filename = filename + " (compiled)"
    module._compile(content, module.filename)
  }
}


module.exports = Kaffeine;

// end module: kaffeine
});

require.module('./plugins/at', function(module, exports, require) {
// start module: plugins/at

var Token = require("../token");

module.exports = function(stream) {

  stream.each(function() {
    if(this.unknown && this.text == "@") {
      var word = "this"

      if(this.next.text == "@") {
        this.next.remove()  
        word = "this.constructor"
      }

      var token = new Token.word(word)
      token.was_at_symbol = true
      this.replaceWith(token)
      if(token.next.word && !token.next.lbracket) 
        token.after(new Token.operator("."))
      return token
    }
  })
}



// end module: plugins/at
});

require.module('./plugins/bang', function(module, exports, require) {
// start module: plugins/bang

var Token = require("../token");

module.exports = function(stream) {
  stream.each(function(token) {

    if(!token.bang) return    
    
    var lbracket = token.next
    
    var func = token.expressionStart()
    
    var indent = token.indent()
    
    var vars = ""
    if(func.prev.assign) {
      var e = func.prev.prev
      var s = e.expressionStart()
      vars = s.remove(e).collectText()
      func.prev.remove()
    }
    
    var rbracket = lbracket.matching
    
    var start_fn = rbracket.next
    var end_fn = start_fn.find(function() {
      if(this.lbracket) return this.matching.next
      if(this.rbracket) return true
    })
    
    var body = start_fn.remove(end_fn.prev)
    
    var fn = this.findClosure()
    body.find(function() {
      if(this.was_at_symbol) {
        var ffn = this.findClosure()
        if(!ffn) {
          fn.vars._this = "this"
          this.text = "_this"
        }
      }
    })
    
    body = body.collectText()
    var endsWithNL = body.match(/\n *$/)
    body = body.replace(/\n/g, "\n  ")
    // if(!body.match(/\n$/))
    //       body += "\n"
    //     body += indent
    body += " "
    
    body = body.replace(/\s*\n( *)$/, function(a, b) { 
      return "\n" + b;
    })
    

    if(!endsWithNL)
      body = body.replace(/\n *$/, " ") 
    var text = "function(" + vars + ") {"  + body + "}"
    
    if(lbracket.next != rbracket)
      text = ", " + text
    
    var tokens = Token.ize(text)
    tokens.banged_function = true
    
    rbracket.before(tokens)
    // if(!rbracket.next.newline)
    //   rbracket.after("\n")
    //token.bang = false
    token.text = token.text.slice(0,token.text.length-1)
    return token.next
  })
}


// end module: plugins/bang
});

require.module('./plugins/brackets_for_keywords', function(module, exports, require) {
// start module: plugins/brackets_for_keywords

var Token = require("../token");

module.exports = function(stream) {
  var ks = ["if", "for", "while", "catch"]  

  stream.each(function() {
    if(ks.indexOf(this.text) < 0 ) return
    
    var n = this.nextNW()
    if(n.lbracket && n.round) return
    
    var pair = Token.bracket.pair("()")
    
    var tok = this
    
    var end = this.find(function(token) {
      if(token.lbracket && token.curly) return true
      if(token.lbracket) return token.matching
      if(token.newline) return true
      if(token.text == ",") {
        if(token.prev.prev != tok) {
          return true
        }
      }
    })
    
    // var end = this.nextNW().expressionEnd(function() {
    //   if(this.text == ",") return true
    // }).next
    
    if(end.text == ",") {
      end.spitRight()
      end = end.next
      end.prev.remove()
    }
    
    if(!end.whitespace)
      end.spitRight()
    
    if(this.next.whitespace) this.next.remove()
    this.after(pair.L)
    var eaten = pair.L.next.eaten.left[0]
    if(eaten && eaten.space)
      pair.L.next.spitLeft().remove()
  
    var eaten = this.eaten.right[0]
    if(eaten && eaten.space)
      this.spitRight().remove()
    
    var curly = end.curly ? end : null;
    
    if(end.prev.whitespace) end = end.prev
    if(end.operator) {
      end.spit(function() { return this.whitespace})
      end = end.next
    }
    end.before(pair.R)
    
    var eaten = pair.R.prev.eaten.right[0]
    if(eaten && eaten.space) {
      pair.R.prev.spitRight().remove()
      pair.R.after(" ")
    }
    
    if(curly)
      curly.updateBlock()
    //if(end.operator) end.replaceWith(new Token.whitespace(" "))
    
    this.addImpliedBraces()
  })

}


// end module: plugins/brackets_for_keywords
});

require.module('./plugins/default_args', function(module, exports, require) {
// start module: plugins/default_args

var Token = require("../token");

module.exports = function(stream) {

  stream.each(function() {
    if(this.text != "function") return 
    var block = this.block
    var bracket = this.block.prevNW().matching
    
    var inserts = []
    this.find(function() {    
      if(this == bracket.matching) return true
      if(this.text == "=") {
        var v = this.prev.text
        var e = this.next.expressionEnd(function() {
          if(this.text == ",") return true
        })
        var val = this.next.remove(e).collectText()
        var ret = this.prev
        this.remove()
        
        inserts.push(v +" = " + v + "==null ? " + val + " : " + v)
        return ret
      }
    })
    
    if(inserts.length)
      this.block.after(" " + inserts.join(", ") + ";")
    
    block.args = block.findArgs()
  })
}



// end module: plugins/default_args
});

require.module('./plugins/extend_for', function(module, exports, require) {
// start module: plugins/extend_for

var Token = require("../token");
module.exports = function(stream) {
  
  stream.each(function() {
    if(this.keyword && this.text == "for") { 
      var text = "",
          bracket = this.next,
          skip = false,
          toks = [], var2, var1, loopWord,
          complex
          
      var closingBracket = bracket.matching

      bracket.next.find(function() {      
        if(this.next == closingBracket) return true
        if(this.semi) { skip = true; return true }
        if(this.word && (this.text == "in" || this.text == "of") ) loopWord = this
        if(this.round) complex = true
        toks.push(this)
      })
      
      var var1 = toks[0]
      if(toks[1].text == ",") var2 = toks[2]
      if(skip) return closingBracket.next
      
      if(complex) {
        loopWord.next.next.cacheExpression()
      }

      var expressionText = loopWord.next.next.collectText(closingBracket.prev)          
      if(expressionText.match(/ /)) expressionText = "(" + expressionText +")"
      var iter, val
      var closure = this.findClosure()
      
      /*function wrapSingleLineBlock() {
        if(!this.block) {
          var pair = Token.bracket.pair("{}")
          closingBracket.after(" ").after(pair.L)
          var nl = 2
          var indent = brace.indent()
          
          var next = pair.L.nextNW()
          if(next.block) {
            var tok = next.block.matching
            if(tok.next.whitespace)
              tok = tok.next
          }
          else if(next.bracelessBlock) {
            var tok = next.bracelessBlock.end
            if(tok.next.whitespace)
              tok = tok.next
          }
          else {
            var tok = closingBracket.find(function() {
              if(this.newline) nl--
              if(nl == 0) return true
            })
          }
          
          tok.after(pair.R)
          if(indent)
            pair.R.before(indent)
          pair.R.after("\n")
          pair.L.updateBlock()
        }
      }*/
      
      var brace = bracket.matching.find(function() { if(this.curly) return true })
      
      if(loopWord.text == "in") { 
        if(!var2) return // nothing to do !
        
        brace.implied = false
        brace.matching.implied = false
        
        var2.prev.remove(var2) 
        iter = var1.text
        val = var2.text
        closure.vars[iter] = true
        closure.vars[val] = true
        
      } else {
        brace.implied = false
        brace.matching.implied = false

        bracket.next.remove(closingBracket.prev)
        iter = var2 ? var2.text : closure.getUnusedVar()
        
        val = var1.text
        closure.vars[iter] = true
        closure.vars[val] = true
        
        var string = iter + " = 0; " + iter + " < " + expressionText + ".length; " + iter + "++"
        bracket.after(string)          
        
      }
      
      var text = " "/* + this.indent()*/ + val + " = " + (complex ? "_xpr" : expressionText) + "[" + iter + "];"
            
      this.block.after(text)
     
      return 
    }
  })
}

// end module: plugins/extend_for
});

require.module('./plugins/hash', function(module, exports, require) {
// start module: plugins/hash

var Token = require("../token");

module.exports = function(stream) {

  stream.each(function() {
    if(this.unknown && this.text == "#") {
      var word = "arguments"
      
      if(!this.next.word)
        word += "[0]"
      else {
        word += "[" + this.next.remove().collectText() + "]"
      }
      ret = this.next
      this.replaceWith(word)
      return ret
    }
  })
}



// end module: plugins/hash
});

require.module('./plugins/implicit_brackets', function(module, exports, require) {
// start module: plugins/implicit_brackets

var Token = require("../token");

module.exports = function(stream) {
  var nobrackets_keywords = {"for":1, "if":1, "while": 1, "new":1,"return":1,"var":1,"throw":1, "in":1,"of":1, "typeof":1, "instanceof":1, "else": 1, "try":1, "catch": 1, "class": 1}
  
  stream.tail().each(function() {
    var ws = this.next
    if(!ws || !ws.space || !ws.next) return
    if(this.word && ((nobrackets_keywords[this.text] && this.prev.text != ".") || this.block)) return
    if(nobrackets_keywords[ws.next.text]) return
    if(this.matching) {
      var prev = this.matching.prevNW()
      if(["for", "if", "while", "else", "catch"].indexOf(prev.text) >= 0)
        return
    } 
    var nn = ws.next
    var match = (this.word || this.rbracket) && (nn.word || nn.lbracket || nn.string) && (nn.blockType != "function")  
    
    if(!match) return
    
    var end = nn.expressionEnd(function() {
	    if(this.text == "," && this.next.next.text == ":") return true
	  }) 

    if(end == null) return
    
    var pair = Token.bracket.pair("()")
    ws.replaceWith(pair.L)
    if(end.whitespace) end = end.prev
    end.after(pair.R)
  }, "prev")
}

// end module: plugins/implicit_brackets
});

require.module('./plugins/implicit_functions', function(module, exports, require) {
// start module: plugins/implicit_functions

var Token = require("../token");

module.exports = function(stream) {
  stream.each(function(token) {
    
    if(token.blockType != "object") return
    if(token.next == token.matching) return // empty object    
    if(token.nextNW().next.text == ":") return // must be an object
    
    var text = "function"
    var prev = token.prevNW()
    
    if(prev.text == ")")
      prev.matching.before("function")
    else
      token.before("function() ")
    
    token.updateBlock()
  })
}


// end module: plugins/implicit_functions
});

require.module('./plugins/implicit_return', function(module, exports, require) {
// start module: plugins/implicit_return

var Token = require("../token");
module.exports = function(stream) {
  stream.each(function() {
    if(!this.blockType || this.blockType != "function") return
    
    if(this.global) return

    var end = this.matching.prev.findRev(function(tok) {
       return (tok.whitespace || tok.semi) ? null : true
    })
    
    if(end == this || end.text == "return") return  // probably an empty function
    
    // sure this could be a bit neater
    var start = end.findRev(function(tok) {
      if(tok.rbracket) {
        return tok.matching        
      }
      else if(tok.lbracket && tok.curly) {
        var type = tok.blockType
        if(type == "function") {
          return tok.prev.findRev(function(t) { 
              if(t.text == "function") return true 
             })
        }
        else if(type == "object") {
          if(tok.prev.whitespace || tok.prev.semi || tok.prev.lbracket) 
            return true
        }
        else return false          
      }
      else if(tok.prev.whitespace) {
        if(tok.prev.prev.text == "new") return tok.prev.prev
        else return true
      }
      else if(tok.prev.semi  || tok.prev.lbracket) 
        return true
      else 
        return null
    })
    
    if(!start) return
    if(start.text == "return") return
    if(start.prev.prev && start.prev.prev.text == "return") return
    
    start
      .before(new Token.whitespace(" "))
      .before(new Token.word("return"))
    
  })
}

// end module: plugins/implicit_return
});

require.module('./plugins/implicit_vars', function(module, exports, require) {
// start module: plugins/implicit_vars

var Token = require("../token");
module.exports = function(stream) {
  var stack = [], variable, current, closure
  
  // remove vars
  stream.each(function(token) {  
    var ret = token.prev
    if(token.text != "var") return
    if(token.next.space)
      token.next.remove()
    token.remove()
    return ret
  })
  
  stream.each(function(token) {    
    if(!token.assign) return 
    variable = token.prev.text
    if(!/^[A-Za-z0-9$_]*$/.test(variable)) return
    if(token.prev.prev.operator) return
    if(token.prev.prev.prev.text == "var") return
    current = closure = this.findClosure()
    var found = false
    
    while(current) {
      if(current.vars[variable] || current.args[variable]) {
        found = true
        break
      }
      current = current.parent
    }
    
    if(!found) closure.vars[variable] = true
  })

}


// end module: plugins/implicit_vars
});

require.module('./plugins/multiline_strings', function(module, exports, require) {
// start module: plugins/multiline_strings

var Token = require("../token");
module.exports = function(stream) {
  var reg = /\n/
  stream.each(function() {
    if(!this.string || !reg.test(this.text)) return
    
    this.text = this.text.replace(/(\\)?\n/g, function(str, escape) {
      return escape ? "\\\n" : "\\n\\\n"
    })
  })
}

// end module: plugins/multiline_strings
});

require.module('./plugins/operators', function(module, exports, require) {
// start module: plugins/operators

var Token = require("../token");
module.exports = function(stream) {
  stream.each(function(token) {
    if(!token.operator) return
    
    if(token.text == "||=")
      var op = "|| "
    else if(token.text == ".=")
      var op = "."
    else return
    
    optoken = token.after(op)  
    token.text = "="

    var lhs = "" 
    token.prev.findRev(function(token) {
      if(token.whitespace || token.unknown) return true
      lhs = token.text + lhs
    })

    var tokens = Token.ize(lhs)    
    if(op != "." ) tokens.tail().eaten.right.push(Token.ize(" "))
    token.after(tokens, tokens.tail())
    
  })
  
  // extend
  var inserted = false
  stream.each(function(token) {
    if(token.text != "<-") return 
    var arrow = this
    var L = this.expressionStart()
    var lhs = L.remove(arrow.prev).collectText()

    var R = arrow.next.expressionEnd(function() {
    })

    var rhs = arrow.next.remove(R).collectText()
    var ret = arrow.prev
    arrow.replaceWith("__extend(" + lhs + ", " + rhs + ")")
    //token.global.vars['__extend'] = __extend.toString()
    
    if(!inserted) {
      var g = stream.block
      if(!g.global) throw "WTF!"
      g.matching.before(new Token.word(__extend))
      inserted = true
    }
    return ret
  })
}

var __extend = "\nfunction __extend(a,b) {\n\
  var c = {}, i;\n\
  a = a || {};\n\
  for(i in a) c[i] = a[i];\n\
  for(i in b) c[i] = b[i];\n\
  return c;\n\
}"

// end module: plugins/operators
});

require.module('./plugins/pipe', function(module, exports, require) {
// start module: plugins/pipe

var Token = require("../token");
module.exports = function(stream) {

  stream.each(function() {
    if(this.text != "|") return
    var pipe = this
	  var L = this.expressionStart()
    var lhs = L.remove(pipe.prev) //.collectText()

    var R = pipe.next.expressionEnd(function() {
     return this.text == "|"
    })

    var rhs = pipe.next.remove(R) //.collectText()
    var ret = pipe.prev
    
    pair = Token.bracket.pair("()")
    
    tokens = Token.ize("__." + pipe.pipe_function + ".call")
    tokens.append(pair.L)
    tokens.append("this, ")
    tokens.append(lhs)
    tokens.append(", ")
    tokens.append(rhs)
    tokens.append(pair.R)
    
    pipe.replaceWith(tokens) //"__." + pipe.pipe_function + ".call(this, " + lhs + ", " + rhs + ")")
    return ret
  })

}



// end module: plugins/pipe
});

require.module('./plugins/pre_pipe', function(module, exports, require) {
// start module: plugins/pre_pipe

var Token = require("../token");
module.exports = function(stream) {

  stream.each(function() {
    if(this.text == "|" || this.text == "|.") {
      var L = this.expressionStart()
      
      if(this.text=="|." || this.next.assign) {
        this.text = "__" + this.text.slice(1)
        delete this.operator 
        this.word = true
        return 
      }
      
      if(this.text != "|")
        throw("unknown pipe operation")
      
      var fn = this.next
      this.pipe_function = this.next.text
	  this.next.remove()
	  if(this.next.whitespace) this.next.remove()
	  return this.next
    }
  }) 
}

// end module: plugins/pre_pipe
});

require.module('./plugins/prototype', function(module, exports, require) {
// start module: plugins/prototype

var Token = require("../token");
module.exports = function(stream) {

  var klass = ""
  stream.each(function() {
    
    if(this.namedFunction) {
      klass = this.namedFunction.text
      return
    }

    if(this.word && this.text == "prototype") {
      if(this.prev.text == ".")
        klass = this.prev.prev.text
      return
    }
    
    var ret = this.next
    
    if(this.text == "::") {
      this.spit(function() { return this.whitespace})
      var text = ".prototype."
      if(this.prev.word)
        klass = this.prev.text
      else
        text = klass + text
      this.replaceWith(text)
    }
    return ret
  })
}



// end module: plugins/prototype
});

require.module('./plugins/string_interpolation', function(module, exports, require) {
// start module: plugins/string_interpolation

var Token = require("../token");
module.exports = function(stream) {
  stream.each(function() {
    if(!this.string) return
    
    // combine nested
    if(/#{"$/.test(this.text)) {
      var text = ""
      var end = this.next.find(function() {
        text += this.text
        if(this.string && /^"}/.test(this.text))
          return true
      })
      this.text += text
      this.next.remove(end)
    }
    
    if(/^".*[#]/.test(this.text)) {
      var ret = this.next
      var string = expandOnce(this.text)
      this.replaceWith(string)
      return ret
    }
    return
  })
  
  // remove double brackets
  stream.each(function() {
    if(this.lbracket && this.round && this.next.lbracket && this.next.round) {
      var n = this.matching.prev
      if(n.rbracket && n.round) {
        this.next.remove()
        n.remove()
      }
    }
  })
    
}

// partially borrowed from visionmedia's Jade
//var regSimple = /(\\)?[$]([A-Za-z0-9.@_]+)/g
var regComplex = /(\\)?#{(.*?)}/g

function expandOnce(text) {
  var changed = false
  var interp = text.replace(regComplex, function(str, esc, code) {
           if(!esc) changed = true 
           return esc ? str.slice(1) : '" + (' + code.replace(/\\"/g,'"') + ') + "';      
         })
  if(changed) 
    interp = "(" + interp + ")"
  
  //interp = interp.replace('"" + ', "")
  interp = interp.replace(' + ""', "")
  return interp
}


// end module: plugins/string_interpolation
});

require.module('./plugins/undouble_brackets', function(module, exports, require) {
// start module: plugins/undouble_brackets

var Token = require("../token");

module.exports = function(stream) {
  stream.each(function() {
    if(this.lbracket && this.round && this.next.lbracket && this.next.round) {
      var n = this.matching.prev
      if(n.rbracket && n.round) {
        this.next.remove()
        n.remove()
      }
    }
  })
}


// end module: plugins/undouble_brackets
});

(function() {
  var kaffeine = require("./kaffeine");

  function load(url, options, callback) {
    var xhr = new (window.ActiveXObject || XMLHttpRequest)('Microsoft.XMLHTTP');
    xhr.open('GET', url, true);

    if ('overrideMimeType' in xhr) {
      xhr.overrideMimeType('text/plain');
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        run(url, xhr.responseText, options);
        if(callback) callback(true)
        return
      }
    };
    try {
     xhr.send(null); 
    } catch(e) {
      console.log("failed loading: " + url)
    }
    return
  }

  function run(src, text) {
    var K = new kaffeine()
    var js = K.compile(text, { brequire_module: src.replace(/\.k/, "") });    
    eval(js)    
    //(Function(js))()
  }

  if (typeof window == "undefined" || window === null) {
    return;
  }

  function loadExternal(callback) {
    var scripts = document.getElementsByTagName('script');
    var to_run = []

    for(var i=0; i < scripts.length;i++) {
      var s = scripts[i]
      if(s.type.match(/kaffeine/) && s.src)
        to_run.push(s)
    }
    for(var i=0; i < to_run.length;i++) {
      var attr = to_run[i].attributes
      for(var i=0; i< attr.length;i++) {
        if(attr[i].nodeName == "src")
          var src = attr[i].value
      } 
      load(src)
    }
  }

  function runInternal() {
    var scripts = document.getElementsByTagName('script');
    for(var i=0; i < scripts.length;i++) {
      var s = scripts[i]
      if(s.type.match(/kaffeine/) && !s.src) {
        run(script.innerHTML)
      }
    }
  }

  loadExternal()

  if (window.addEventListener) {
    addEventListener('DOMContentLoaded', runInternal, false);
  } else {
    attachEvent('onload', runInternal);
  }
}).call(this)