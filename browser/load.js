var list = "operators backticks englify brackets unless @ brackets_for_functions half_operators arrow implicit_vars implicit_return reverse_blocks using indented_blocks enum pipe multiline_strings string_interpolation".split(" "); 
for(var i in list) { document.write("<script src='plugins/" + list[i]+ ".js'></scr" + "ipt>") }

$().ready(function() {
  var stream
  $("script[type=kaffeine]").each(function() {
    var d = new Date()
    var text = $(this).html()
    var input = $("<textarea class=input></textarea>").val(text)

    var K = new Kaffeine()
    text = K.process(text)
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
  var out = Kaffeine.process($(this).val())
  
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
      }, 150)
      
    })
  }, 1000)
})
