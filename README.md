Kaffeine
========

Goals
----

* Progressively enhance Javascript syntax: ensure vanilla Javascript still works as normal
* avoid nice-to-haves, concentrate on small useful feature set and pragmatism
* Robust
  - want to avoid examining the compiled javascript
  - implies syntax should very unambiguous
  - want to create javascript that's not _too_ far from the kaffeine
* Hackable, modular, extendable and testable
* avoid significant whitespace - looks nice, but is painful to work with.

Example
=======

The following code illustrates many of Kaffeine's features:
<pre>
Edge::add = (nick, name, complete) {
  @client.select 15
  user = User.find! {id: nick}
  puzzle = Puzzle.find! {name: name}
  err, data = User.client.set! "User:#{user.id}:puzzle:#{puzzle.id}"
  complete()
}
</pre>

this compiles to:
<pre>
Edge.prototype.add = function(nick, puzzle_name, complete) {
  this.client.select(15)
  User.find({id: nick}, function(user) {
    Puzzle.find({name: puzzle_name}, function(puzzle) {
      User.client.set(("User:" + (user.id) + ":puzzle:" + (puzzle.id)), function(err, data) {
        return complete()
      })
    })
  })
}
</pre>
Plugins list
=========

Implicit functions
-----------------


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


hash
----

provides the # shortcut for referring to the first argument in a function. Useful for terse function definitions, e.g:

square = { #*# }

additionally, #n refers to the nth argument (n >= 0)

implicit_functions
--------

the function keyword can be optionally omitted, along with empty argument lists. Note {} could be ambiguously a function or an object, so it's defined to be an function, to express an empty function, use one of the following :

{;}
{null}
function() { }

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

