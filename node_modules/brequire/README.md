Brequire
========

Brings exact CommonJS (require, exports) functionality to the Browser.

It has two parts: 

1) A simple compiler that wraps your files in a closure that injects bound of require and exports, so you can use the exact same code client side.

2) A client side library that provides a require keyword

Install
------

npm install brequire

API
---

Create a an instance of the compiler with <code>require("brequire")("path/to/my/module")</code>

The various options can then be set via method calls: 

* include_lib()
use this method to write out the client side library along with the source files. 

* module_base(name)
us this method to change the module base name

* search(path, [path2, path3 etc... ]) 
set the search paths for the scripts to load from the root. 
the paths can use globs
defaults to **.js

* inspect 
will output the current state of the compiler including the files to be processed.

To output the files, use write:

* write(path) 

this wraps each file with a special closure writes it to disk.
if _path_ ends with '.js': the files will all be bundled together into one script.
otherwise path is assumed to be a directroy and each file will be written out separately, the structure mirroring the src directory


Example Usage
---

<pre>
var brequire = require("brequire")

brequire("./test/shape").write("./lib/shape.bundle.js")
</pre>

<pre>
brequire("./test/shape")
  .include_lib()
  .write("./test/browser/lib")
</pre>

<pre>
brequire("./test/user")
  .module_base("user_alt")
  .include_lib()
  .inspect()
  .write("./test/browser/lib/user.bundle.js")
</pre>




Command Line Interface
---

this is not working at present. needs a rewrite => should be back soon enough


Test
----

expresso 