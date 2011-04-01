$(function(){
  $("pre")
    .each(function() {
      var x = $(this).html()
      x = x.replace(/\n\s*\n/g, "\n") 
      x = x.replace(/\n\/\//g, "\n\n//")
      x = x.replace(/\n\/\*/g, "\n\n/*")
      x = x.replace(/\n*$/,"")
      $(this).html(x)
    })
    .each(function() {
      $(this).addClass("javascript")
    })
    .wrap("<div class=code></div>")
  
  
})


$(function() {
  Kaffeine = require("kaffeine")
  
  $(".code")
    .each(function() {
      var K = new Kaffeine()
      var text = K.compile($(this).find("pre").text())
      text = text.replace(/^\s+/,"")
      $(this).append("<pre class='javascript rhs'>" + text + "</pre>")
    })
})



