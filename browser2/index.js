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
  
  function compile(string) {
    var K = new Kaffeine()
    try {
      var text = K.compile(string)
    }
    catch(e) {
      if(e.plugin)
        var text = "Error in plugin " + e.plugin + ":\n"  + e.toString() +"\n Current Stream: \n" + K.currentStream.collectText()
      else 
        var text = e.toString() //console.log(e) // ignore ...
    }
    return text
  }

  if($("#kaffeine").val()) {
    var string = $("#kaffeine").val()
    $("#javascript").val(compile(string))
  }
  $("#kaffeine").focus()
  
  $("pre").each(function() {
    var text = $(this).html().replace("&lt;-", "<-", "g")
    var pre = $("<pre>")
    $(this).css({position: "relative"})
    var h = $(this).height()
    pre.html(compile(text))
    pre.insertAfter(this)
    var arrow = $("<div class=arrow>-></div>")
    arrow.css({position: "absolute", right: 0, top: h/2, marginRight: -24, fontSize: 14, fontWeight: "bold", color: "red"})
    $(this).append(arrow)
    
  })
})



