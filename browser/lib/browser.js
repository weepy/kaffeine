require.module('./browser', function(module, exports, require) {
// start module: browser

(function() {
  var kaffeine = require("./kaffeine");

  function load(url, options, callback) {
    var xhr = new (window.ActiveXObject || XMLHttpRequest)('Microsoft.XMLHTTP');
    xhr.open('GET', url, true);

    if ('overrideMimeType' in xhr) {
      xhr.overrideMimeType('text/plain');
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        run(url, xhr.responseText, options);
        if(callback) callback(true)
        return
      }
    };
    try {
     xhr.send(null); 
    } catch(e) {
      console.log("failed loading: " + url)
    }
    return
  }

  function run(src, text) {
    var K = new kaffeine()
    var js = K.compile(text, { brequire_module: src.replace(/\.k/, "") });    
    eval(js)    
    //(Function(js))()
  }

  if (typeof window == "undefined" || window === null) {
    return;
  }

  function loadExternal(callback) {
    var scripts = document.getElementsByTagName('script');
    var to_run = []

    for(var i=0; i < scripts.length;i++) {
      var s = scripts[i]
      if(s.type.match(/kaffeine/) && s.src)
        to_run.push(s)
    }
    for(var i=0; i < to_run.length;i++) {
      var attr = to_run[i].attributes
      for(var i=0; i< attr.length;i++) {
        if(attr[i].nodeName == "src")
          var src = attr[i].value
      } 
      load(src)
    }
  }

  function runInternal() {
    var scripts = document.getElementsByTagName('script');
    for(var i=0; i < scripts.length;i++) {
      var s = scripts[i]
      if(s.type.match(/kaffeine/) && !s.src) {
        run(script.innerHTML)
      }
    }
  }

  loadExternal()

  if (window.addEventListener) {
    addEventListener('DOMContentLoaded', runInternal, false);
  } else {
    attachEvent('onload', runInternal);
  }
}).call(this)

// end module: browser
});
