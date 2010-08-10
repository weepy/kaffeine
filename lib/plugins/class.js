exports['class'] = function(stream, Token) {
  var insertedExtends
  stream.each(function() {
    if(!this.word || this.text != "class") return
    
    var xtends, superClass, klass
    var start = this.next.next
    if(start.word)
      klass = start.text
    else if(!start.lbracket)
      throw "unknown class name"    
    
    var hasArgs = false
    
    var curly = start.find(function() { 
      if(this.lbracket && this.round) hasArgs = true
      if(this.word && this.text == "extends") {
        superClass = this.next.next
        var next = superClass.next.whitespace ? superClass.next.next  : superClass.next
        this.remove(next.prev)
        return next
      }
      if(this.curly) return true
    })
    
    if(!hasArgs) {
      if(klass)
        start.after(Token.ize("()"))
      else
        start.before(Token.ize("()"))
    }
    
    if(!insertedExtends) {
      stream.global.next.after(new Token.word(__extends.toString() + "\n"))
      insertedExtends = true
    }
    
    if(superClass) {
      curly.matchingBracket.after(new Token.word( "\n__extends(" + klass +  ", " + superClass.text + ")"))
      curly.superClass = superClass ? superClass.text : "undefined"
    }
    
    this.text = "function"
    this.keyword = true
    curly.updateBlock()
    curly.klass = klass || "undefined"
    curly.matchingBracket.before(this.indent()+ "  return this\n")
    
  })
}

function __extends(child, parent) {
  var ctor = function(){};
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.prototype.constructor = child;
  if (typeof parent.extended === "function") parent.extended(child);
  child.__superClass__ = parent.prototype;
};


// 
// 
// exports['class'] = function(stream, Token) {
//   // var ks = ["if", "for", "while", "catch"]
//   var insertedExtends
// 
//   stream.each(function() {
//     if(!this.word || this.text != "class") return
//     var xtends = null
//     
//     var curly = klass.find(function() {
//       if(this.text == "extends") {
//         xtends = this
//       }
//       if(this.curly) return true      
//     })
//     
// 
//     var pair = Token.bracket.pair("()")
//     this.next.replaceWith(pair.L)
//     
//     var where = curly.prev.whitespace ? curly.prev : curly
//     where.before(pair.R)
//     
//     var superClass 
//     if(xtends) {
//       superClass = xtends.next.next.text
//       xtends.remove(xtends.next.next)
//     }
//     
// 
//     
// 
//     
//     return curly.matchingBracket
//   })
// 
// }



  
// 
// 
// class Animal(x,y) {
// 
// }
//   
// class Snake extends Animal {
//   super()
//   super
// }
// 
// Snake::hood = -> 
//   super
//   super()
// 

//   
// function Animal(x,y) {
//   return this
// }
// 
// function Snake() {
//   Snake__superClass__.constructor.call(this);
//   Snake.__superClass__.constructor.apply(this, arguments);
//   return this
// }
// __extends(Snake, Animal);
// 
// Snake.prototype.hood = function() {
//   Snake.__superClass__.hood.apply(this, arguments);
//   Snake.__superClass__.hood.call(this);  
// }
