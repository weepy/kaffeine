#kaffeine multiline_strings brackets_for_functions

ok "this
occurs 
over 
several 
lines
".split("\n").length > 1

ok "this is a \
single \ 
line\
".split("\n").length == 1