$().ready(function() {
  $("textarea").each(function() {
    var x = $(this).html()
    $(this).replaceWith($("<pre>" + x + "</pre>"))
  })
  
  $(window).sausage({page: ".section"});
  
})

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

// 
// $(function() {
//   Kaffeine = require("kaffeine")
//   
//   $(".code")
//     .each(function() {
//       var kaf = $(this).find("pre").text()
//       console.log(kaf)
//       var K = new Kaffeine()
//       var text = K.compile(kaf)
//       text = text.replace(/^\s+/,"")
//       $(this).append("<pre class='javascript rhs'>" + text + "</pre>")
//     })
//     
//      CodeHighlighter.init()
//      
// })


$(function() {
  Kaffeine = require("kaffeine")


  function compile() {
    $(".rhs").remove()
    
    $(".code")
      .each(function() {
        var K = new Kaffeine()
        var text = K.compile($(this).find("pre").text(), $(":radio:checked").val() )
        text = text.replace(/^\s+/,"")
        $(this).append("<pre class='javascript rhs'>" + text + "</pre>")
      })
    
    CodeHighlighter.init()
  }
  
  $(":radio").click(compile)
  compile()

})





