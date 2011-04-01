$().ready(function() {
  Kaffeine = require("kaffeine")
  
  var stream
  
  var timer 
  $("#kaffeine").keyup(function(e) {
    if(timer) clearTimeout(timer)
    timer = setTimeout(compile, 200)    
  })
  
  function compile() {
    var K = new Kaffeine()
    try {
      var opts = null

      
      var text = K.compile($("#kaffeine").val(), $(":radio:checked").val() )
      $(".error").text("")
    }
    catch(e) {
      if(e.plugin)
        var text = "Error in plugin " + e.plugin + ":\n"  + e.toString() +"\n Current Stream: \n" + K.currentStream.collectText()
      else 
        var text = "Error: " + e.toString()
    }
    
    var lines = text.split("\n")
    
    $("#javascript").val(lines.join("\n"))
  }

  if($("#kaffeine").val())
    compile()
  $("#kaffeine").focus()
  
  $(":radio").click(compile)
})



