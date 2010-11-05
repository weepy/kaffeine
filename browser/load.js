var Plugins = "pipe bang arrow at implicit_brackets extend_for implicit_return implicit_vars multiline_strings prototype string_interpolation".split(" "); 
for(var i in Plugins) { document.write("<script src='lib/plugins/" + Plugins[i]+ ".js'></scr" + "ipt>") }



window.highlightDirtyCallback = function(_this) {
  var K = new Kaffeine()
  try {
    var text = K.compile(_this.getCode())
  }
  catch(e) {
    if(e.plugin)
      var text = "Error in plugin " + e.plugin + ":\n"  + e.toString() +"\n Current Stream: \n" + K.currentStream.collectText()
    else 
      var text = e.toString() //console.log(e) // ignore ...
  }
  
  try { 
    new Function(text)
  }
  catch(e) {
    text = "/* Invalid JS \n * " + e.toString() + "\n */\n\n" + text
  }
  
  
  HIJS($("#" + _this.options.id).next().next(), text + "\n") 
  
  // var h = $(window.frames[0].document.body).height()
  // $(".CodeMirror-wrapping").height(h+20)
  
  $(".hijs").css({"min-height": $(".CodeMirror-wrapping").height() })
}


var Kaffeine
$().ready(function() {
  Kaffeine = require("./kaffeine").Kaffeine
  
  var stream

  for(var i in Plugins) { 
    var p = Plugins[i]
    Kaffeine.plugins[p] = require("./plugins/"+p)[p]
  }
  

  var i = 0;
  
        
  function load() {
    var hash = (document.location.hash || "#examples/index").slice(1)
    
    $("#examples a").removeClass("on")
    $("#examples a[href=#" + hash+ "]").addClass("on")
  
    $.get(hash + ".k", function(data) {
      $(".CodeMirror-wrapping").remove()

      $("textarea").val(data);

      var id = "kaffeine1"

      var editor = CodeMirror.fromTextArea(id, {
        height: 500,
        parserfile: ["tokenizejavascript.js", "parsejavascript.js"],
        stylesheet: "ext/code_mirror/css/jscolors.css",
        path: "ext/code_mirror/js/",
        continuousScanning: 250,
        id: id
      });
      editor.id = id
            // 
            // window.highlightDirtyCallback(editor)
      
      $(window.frames[0].document.body).click()
    })
    
  }
  
  load()
  
  $(window).hashchange(function() {
    load()
  })

})



