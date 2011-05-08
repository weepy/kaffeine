<pre>
  _  __      __  __     _           
 | |/ /__ _ / _|/ _|___(_)_ _  ___  
 | ' &lt;/ _` |  _|  _/ -_) | ' \/ -_) 
 |_|\_\__,_|_| |_| \___|_|_||_\___|
</pre>


* Progressively enhance Javascript syntax: ensure vanilla Javascript still works as normal
* avoid nice-to-haves, concentrate on small useful feature set and pragmatism
* Hackable, modular, extendable and testable
* whitespace is _not_ significant. Looks nice, but is painful to work with.


Example
=======

<pre>
Edge::add = (nick, name, complete) {
  @client.select 15
  user = User.find! {id: nick}
  puzzle = Puzzle.find! {name: name}
  err, data = client.set! "u:#{user}:p:#{puzzle}"
  complete()
}
</pre>

READ MORE HERE ---> http://weepy.github.com/kaffeine <-----

also on IRC: #altjs


Tests
=====

* via Node
  - <code>bin/expect</code> will run all tests
  - <code>bin/expect file_name</code> will a particular test e.g. <code>bin/expect expectations/arrow</code>
* via Browser
  - load browser/runner.html

* Integration tests:
  - node test/test_node.js
  - knode test/test_knode.js

Building tests for the browser
=====

bin/build

depends on brequire (http://github.com/weepy/brequire). 

Install
=======

npm install kaffeine

requires node >= 0.3.1 

Use
===

Compile a script from the command line:
<pre>kaffeine -c /path/to/script.k</pre>

See <code>kaffeine --help</code> for more


Run a kaffeine file directly
<pre>knode /path/to/script.k</pre>

require kaffeine files in scripts (in this case my_script.k):
<pre>
require('kaffeine')
require('my_script')
</pre>

TODO
====

* need --- operator for delimiting bangs!
* nested for loops - is there a problem ? 
