Kaffeine
========

Goals

* make daily JS more enjoyable

* avoid nice-to-haves, concentrate on pragmatism, and syntax that would be used very often

* Progressively enhance Javascript syntax: ensure vanilla Javascript still works as normal

* Robust - implies syntax should very unambiguous

* we don't want to have to examine the compiled javascript to determine where we have made an error (either in compilation or in writing kaffeine)

* Hackable, modular, extendable and testable


Install
=======

npm install kaffeine (TBD)

Use
===

TBD


TODO
----

* work out how best to use.
* npm install
* nested for loops not working.


Plugins list
=========

Arrow
----- 

Provides the arrow operator (->) as a alias for 'function'

E.g

-> run(args) {
  Legs.create(2)
}

Async
-----
Allows function calls with callbacks to be unwrapped via a ! postfix. E.g:

fish = $.get!('/fish')
$("stomach").append(fish)


@
--

Provide the @ alias for 'this'. It is also linked to the parent 'this' in the case of a function defined via 'async!'. E.g

@legs = legs
@color = color


implicit var
-----------

provides support for omitting the var keyword: the variables will be automagically defined in the closest relevant closure. E.g.

x = 1
y = 2

implicit brackets
-----------------

Provide optional brackets for function calls. E.g.

remove eggs.shell
mix eggs, milk

multiline strings
-----------------

Allow multiline strings: 

html = "
<body>
<h1>SOY SAUCE</h1>
</body>
"

This would maintain the new lines --- but they can be suppressed with the \ character 


extended for
-----------

Allows an 'of' operator for looping through arrays: 

for(x of [7,3,4])
  sum += x
// sum == 14

Allows allows an optional second parameter to refer to the key or value: 

for(x, i of [7,3,4])
  sum += i
// sum == 3


yield
-----

provides a yield keyword that can be used to callback the return value to callback that's provided as the last argument

asyncAdd = -> (x,y) {
  yield x + y
}

string interpolation
--------------------

provides ruby style string interpolation via #{}

letter = "Dear #{name},
I am writing to you to inform you of #{purpose}
Kind Regards
#{sender}
"

implicit return
---------------

the last statement of a function will be automagically returned. E.g.

getName = -> { @name } 


Tests
-----

via Browser
* load browser/index.html, with the test as a hash, e.g <code>/index.html#test/string_interpolation</code>

via Node
* <code>bin/test</code> will run all tests
* <code>bin/test file_name</code> will a particular test e.g. <code>bin/test arrow</code>


Building tests for the browser
----

bin/build

The codebase is written using CommonJS which is not natively supported in the browser. To run in the browser environment, the plugins need to be compiled with brequire. 
See http://github.com/weepy/brequire (npm install brequire)
