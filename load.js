var list = "operators backticks englify brackets unless @ brackets_for_functions half_operators arrow implicit_vars implicit_return reverse_ifs".split(" "); 
for(var i in list) { document.write("<script src='plugins/" + list[i]+ ".js'></scr" + "ipt>") }

$().ready(function() {
  var stream
  $("script[type=kaffeine]").each(function() {
    var d = new Date()
    var text = $(this).html()

    
    var input = $("<textarea class=input></textarea>").val(text)

    text = Kaffeine.process(text)
    var output = $("<textarea class=output></textarea>").val(text)
    $(this).after(output);  
    $(this).after(input); 
        
    console.log(new Date - d)
  })
  $("textarea").each(function() {
    $(this).autoHeight()
  })
})
