for(var i in Plugins) { document.write("<script src='lib/plugins/" + Plugins[i]+ ".js'></scr" + "ipt>") }

$().ready(function() {
  Kaffeine = require("./kaffeine")
  
  var stream

//  for(var i in Plugins) { 
//    var p = Plugins[i]
//    Kaffeine.plugins[p] = require("./plugins/"+p)[p]
//  }
  
  var timer 
  $("#kaffeine").keyup(function(e) {
    //console.log(e.keyCode)
    if(timer) clearTimeout(timer)
    timer = setTimeout(compile, 200)    
  })
  
  function compile() {
    var K = new Kaffeine()
    //try {
      var text = K.compile($("#kaffeine").val())
    /*}
    catch(e) {
      if(e.plugin)
        var text = "Error in plugin " + e.plugin + ":\n"  + e.toString() +"\n Current Stream: \n" + K.currentStream.collectText()
      else 
        var text = e.toString() //console.log(e) // ignore ...
    }*/
    
    var lines = text.split("\n")
    
    // add lines
    // var max = 0
    // for(var i=0; i< lines.length; i++) {
    //   if(lines[i].length > max)
    //     max = lines[i].length
    // }
    //   
    // for(var i=0; i< lines.length; i++) {
    //   var l = max - lines[i].length + 2
    //   lines[i] = lines[i] + (new Array(l)).join(" ") + "// " + (i+1)      
    // }
    
    $("#javascript").val(lines.join("\n"))
  }

  if($("#kaffeine").val())
    compile()
  $("#kaffeine").focus()
})



