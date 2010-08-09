var Plugins = "operators double_brackets existential backticks englify extend_for brackets unless at brackets_for_functions half_operators arrow implicit_vars implicit_return reverse_blocks using indented_blocks enum pipe multiline_strings string_interpolation".split(" "); 
for(var i in Plugins) { document.write("<script src='lib/plugins/" + Plugins[i]+ ".js'></scr" + "ipt>") }

$().ready(function() {
  var stream

  for(var i in Plugins) { 
    var p = Plugins[i]
    Kaffeine.plugins[p] = require("./lib/plugins/"+p)[p]
  }
  
  
  $("script[type=kaffeine]").each(function() {
    var d = new Date()
    var text = $(this).html()
    var input = $("<textarea class=input></textarea>").val(text)

    var K = new Kaffeine()
    text = K.compile(text)
    var output = $("<textarea class=output></textarea>").val(text)
    $(this).after(output);  
    $(this).after(input); 
        
    //console.log(new Date - d)
  })
  $("textarea").each(function() {
    $(this).autoHeight()
  })
  
  $(".output").live("click", function() {
    eval($(this).val())
  })
  
  
})



function process() { 
  var self = this
  var output = $(this).next().next()
  var out = new Kaffeine().compile($(this).val())
  
  $(self).trigger("autoheight")
  $(output).val(out).trigger("autoheight")
}

$().ready(function() {
  setTimeout(function() {
    $(".input").keyup(function(e) {
      if( e.which >= 37 && e.which <=40 )
       return;
      
      // abort on shift, cmd, etc.
      if( e.which >= 16 && e.which <= 18 )
       return;

      clearTimeout(this.timer)    			
      var self = this
      this.timer = setTimeout(function() {
        process.call(self)
      }, 50)
      
    })
  }, 1000)
})
