require.module('./plugins/extended_arguments', function(module, exports, require) {
// start module: plugins/extended_arguments

var Token = require("../token");
exports.extended_arguments = function(stream) {
    stream.each(function() {
      if(!this.args) return
    
      var args = []
      
      for(var i in this.args) {
        args.push(i)
      }
      
      for(var i in args) {
        var arg = args[i]
        if((/^this/).test(arg)) {
          var v = arg.replace(/^this\./, "")
          args[i] = v
          v = v.split("=")[0]
          var indent = this.indent()+"  "
          this.after("\n"+indent+"this."+v+" = "+v+";")
        } 
      }
      
      for(var i in args) {
        var arg = args[i]
        if((/=/).test(arg)) {
          var kv = arg.split("=")
          args[i] = kv[0]
          var indent = this.indent()+"  "
          this.after("\n"+indent+kv[0]+" = "+kv[0]+" === undefined ? "+kv[1]+" : "+kv[0]+";")
        }
      }
      

      
      this.args = {}
      for(var i in args) {
        this.args[i] = args[i]
      }

      var L = this.findRev(function() { if(this.lbracket && this.round) return true} )
      var R = L.matchingBracket
      if(L.next != R)
        L.next.remove(R.prev)
      
      if(args.length)
        L.after(args.join(", "))
    })
}  



// end module: plugins/extended_arguments
});
