## Operators



### :: operator

This provides a shortcut to the prototype operator. Without a preceed class, it will assume to be the last reference class or function defintion

<pre>
Animal = {}
::fast = function() { return this.speed > 100 }
::alive = true
</pre>

<pre>
Mammal = {}
::legs = function() { return 4 }
Mammal::lungs = true
</pre>


### .= and ||= and <-

2 extra assignment operators, <code>||=</code> and <code>.=</code>. They work in a similar method as <code>+=</code> etc.

<pre>
location.href .= replace "?old", "?new"
name .= toUpperCase()
opts ||= {}
</pre>

Also an extend operator <code>><-</code>
This creates a new object as opposed to overwriting, so you will need to assign it
<pre>
a <- b 
options = options <- { size: "small", num: 10}
</pre>

### pipe

This is probably one of the most unusual features of Kaffeine. It provides an alternative calling method than can be used for chaining (UNIX style passing)

### Exmamples

<pre>
result = input | fn args
</pre>

### Chaining input to output
<pre>
result = input | fn a, b | fn2 c | fn3 d
</pre>


For example, it is very useful for ruby style enumeration chaining without using prototypes, and other utilities
<pre>
| = require "pipe_utils"

People | map { #.name } | detect { #.length > 3 }

opts = opts | extend default
5 | times { if(!send()) return false }

names | asyncMap (name, fn) {
  user = User.find! {name: name}
  fn(user)
}, complete
</pre>

<code>pipe_utils</code> is a v useful utility belt full of functions, available on npm and github