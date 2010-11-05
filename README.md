Kaffeine
========

Goals
----

* Progressively enhance Javascript syntax: ensure vanilla Javascript still works as normal
* avoid nice-to-haves, concentrate on small useful feature set and pragmatism
* Robust
  - we don't want to have to examine the compiled javascript to determine where we have made an error (either in compilation or in writing kaffeine)
  - implies syntax should very unambiguous
  - we don't want to create javascript that's _too_ far from the kaffeine
* Hackable, modular, extendable and testable
* avoid siginificant whitespace. It looks nice, but is painful to work with.

Example
=======

The following code illustrates most of Kaffeine's features:
<pre>
Edge::add = -> (nick, puzzle_name) {
  @client.select 15
  user = User.find! {id: nick}
  puzzle = Puzzle.find! {name: puzzle_name}
  err, data = User.client.set! "User:#{user.id}:puzzle:#{puzzle.id}"
  yield data
}
</pre>

Plugins list
=========

Arrow
----- 

Provides the arrow operator (->) as a alias for 'function'

E.g
<pre>
-> run(args) {
  Legs.create(2)
}
</pre>

Bang
-----
Allows function calls with callbacks to be unwrapped via a ! postfix. E.g:

<pre>
fish = $.get!('/fish')
$("stomach").append(fish)
</pre>

@
--

Provide the @ alias for 'this'. It is also linked to the parent 'this' in the case of a function defined via 'async!'. E.g

<pre>
@legs = legs
@color = color
</pre>

implicit var
-----------

provides support for omitting the var keyword: the variables will be automagically defined in the closest relevant closure. E.g.

<pre>
x = 1
y = 2
</pre>
  
implicit brackets
-----------------

Provide optional brackets for function calls. E.g.

<pre>
remove eggs.shell
mix eggs, milk
</pre>
  
multiline strings
-----------------

Allow multiline strings: 

<pre>
html = "
&lt;body>
&lt;h1>SOY SAUCE&lt;/h1>
&lt;/body>
"
</pre>

This would maintain the new lines --- but they can be suppressed with the \ character 


extended for
-----------

Allows an 'of' operator for looping through arrays: 

<pre>
for(x of [7,3,4])
  sum += x
// sum == 14
</pre>
Allows allows an optional second parameter to refer to the key or value: 

<pre>
for(x, i of [7,3,4])
  sum += i
// sum == 3
</pre>

yield
-----

provides a yield keyword that can be used to callback the return value to callback that's provided as the last argument

<pre>
asyncAdd = -> (x,y) {
  yield x + y
}
</pre>

Note this isn't written yet

string interpolation
--------------------

provides ruby style string interpolation via #{}

<pre>
letter = "Dear #{name},
I am writing to you to inform you of #{purpose}
Kind Regards
#{sender}
"
</pre>

implicit return
---------------

the last statement of a function will be automagically returned. E.g.

<pre>
getName = -> { @name } 
</pre>



Tests
=====

* via Node
  - <code>bin/test</code> will run all tests
  - <code>bin/test file_name</code> will a particular test e.g. <code>bin/test arrow</code>
* via Browser
  - load browser/index.html, with the test as a hash, e.g <code>/index.html#test/string_interpolation</code>


Building tests for the browser
=====

bin/build

The codebase is written using CommonJS which is not natively supported in the browser. To run in the browser environment, the plugins need to be compiled with brequire. 
See http://github.com/weepy/brequire (npm install brequire)


Install
=======

npm install kaffeine (TBD)


Use
===

* Via command line, TBD
* Via node, TBD
* Via nodek, TBD



TODO
====

* work out how best to use.
* npm install
* nested for loops not working.
* how to handle @ in bang functions

* yield plugin
  - how to handle yield in nested functions
  - perhaps don't need ?

