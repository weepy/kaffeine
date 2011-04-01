## Function Extensions


### implicit_functions

The function keyword can be optionally omitted, along with empty argument lists:

<pre>
ok = (timeout) {
  sendNote()
  setTimeout { run() }, timeout
  return true
}
</pre>
	
#### Gotcha
according to this definition <code>{}</code> or <code>{ }</code> could be a <code>function</code> or an <code>object</code>, so to avoid ambiguity:
it is defined to be an <code>object</code>. 

To express an empty function, make sure it has some code within. For example:

<pre>
{;}
{null}
function() {}
</pre>


### implicit return

The last statement of a function will be automagically returned (Ruby style). For example

<pre>
getName = { @name } 
</pre>

This will only work for returnable statements, i.e. variables, objects and functions. So an final <code>if</code> statement will result no return value

<pre>
getName = { 
  if truthy 
    @name 
} 
</pre>

#### gotcha

A constructor must not return an array or an object to work properly. So make sure you do not accidently do this

Animal = (name) {
  @name = name 
  @friends = []  // wrong => new Animal() won't work properly
}

Animal = (name) {
  @friends = []  
  @name = name   // better => providing you're sure that name will be a string or null
}

Animal = (name) {
  @friends = []  
  @name = name   
  return         // best => cannot break
}

### hash alias

Kaffeine provides <code>#</code> shortcut for referring to the first argument in a function. 
Additionally, <code>#n</code> refers to the nth argument (n >= 0). Useful for terse function definitions:

<pre>
//
square = { 
  #*# 
}

//
times = { 
  #*#1 
}
</pre>


### default arguments

This module allows support for ruby-syle defaults for <code>null</code> or <code>undefined</code> arguments. 
Note, this uses non strict comparison with null, meaning falsy values such as <code>0</code> or <code>""</code> can be used as default.

<pre>
fn = 
(x=1, a=0) {
  log x, a
}

fn 5  // => 5, 0
</pre>
