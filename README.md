Kaffeine
==

Design your own Javascript.

Inspired by Coffee script, but works by incrementally adding new syntax features via plugins.

Core code is ~500 lines of code, and plugins are about 10-50 lines long.

Status
-----

Nearly all tests are passing. 
Near feature parity with CoffeeScript

Current Plugins
------
Arrow: -> alias for function
at: @ alias for this
backticks: simple lambda function syntax square: `#*#`
brackets_for_functions: implicit brackets for function calls
brackets_for_keywords: implicit brackets for function, if, for types
class: CoffeeScript style class (slightly different syntax)
double_brackets:  ((x)) -> (x)
englify: support and, or, not, is, isnt
existential: provides not null operator via ? and typeof is not undefined via ??
extend_for: provides support for 'of' to iterate over arrays, and also allows 2nd parameter for the value in 'of' and 'in'
half_operators: x = .toString() 
implicit_return: ruby style return from last statement
implicit_vars: Coffee style inserts variable declarations in enclosing closure
indented_blocks: implicit curly braces via indentation ( )
multiline_strings
operators: allows arbitrary operators to be defined on prototypes
pipe: unix style function calling
prototype: shortcut for porperties on prototype
reverse_blocks: return if condition()
string_interpolation: using $
super: Coffee style super class
unless: not if
using: insert properties of objects into the local scope (uses eval)



Tests
-----

in the browser 

* load test.html

via node

* bin/test


Building tests for the browser
----

to build plugins for browser usage (needs http://github.com/weepy/brequire installed):

brequire lib browser/lib





