#multiline_strings implicit_brackets

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