Kaffeine
==

Designer Javascript.

Aims to incrementally add new syntax features to Javascript. Features are opt-in only, meaning vanilla Javascript will work as expected.

Works via plugins, each of which adds an atomic feature. Syntax supported mostly follows CoffeeScript, but there are some differences.
Plugins are fairly simple to write.

Core code is ~500 lines of code, and plugins are about 10-50 lines long.

Status
-----

Nearly all tests are passing. 

Current Plugins
------
* Arrow: -> alias for function
* at: @ alias for this
* backticks: simple lambda function syntax square: `#*#`, `.length`
* implicit_brackets: implicit brackets for function calls
* brackets_for_keywords: implicit brackets for function, if, for types
* class: CoffeeScript style class (slightly different syntax)
* double_brackets:  ((x)) -> (x)
* englify: support and, or, not, is, isnt
* existential: provides not null operator via ? and typeof is not undefined via ??
* extend_for: provides support for 'of' to iterate over arrays, and also allows 2nd parameter for the value in 'of' and 'in'
* half_operators: x = .toString() 
* implicit_return: ruby style return from last statement
* implicit_vars: Coffee style inserts variable declarations in enclosing closure
* indented_blocks: implicit curly braces via indentation ( )
* multiline_strings
* operators: allows arbitrary operators to be defined on prototypes
* pipe: unix style function calling
* prototype: shortcut for porperties on prototype
* reverse_blocks: return if condition()
* string_interpolation: using $
* super: Coffee style super class
* unless: not if
* using: insert properties of objects into the local scope (uses eval)



Tests
-----

via Browser
* load test.html, with the test as a query parameter, e.g <code>/test.html?backticks.k</code>

via Node
* <code>bin/test</code> will run all tests
* <code>bin/test file_name</code> will a particular test e.g. <code>bin/test arrow</code>


Building tests for the browser
----

The codebase is written using CommonJS which is not natively supported in the browser. To run in the browser environment, the plugins need to be compiled with brequire:

brequire lib browser/lib

see http://github.com/weepy/brequire for installation instructions.





