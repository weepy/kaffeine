var Plugins = "operators double_brackets existential backticks englify extend_for brackets unless at brackets_for_functions half_operators arrow implicit_vars implicit_return reverse_blocks using indented_blocks enum pipe multiline_strings string_interpolation".split(" "); 
for(var i in Plugins) { document.write("<script src='browser/lib/plugins/" + Plugins[i]+ ".js'></scr" + "ipt>") }
