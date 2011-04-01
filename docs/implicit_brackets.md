## Implicit Brackets

Kaffeine provides support for 

### optional brackets in function calls

<pre>
remove eggs.shell
mix eggs, milk.off ? milk : null
outer inner innermost
</pre>


### optional brackets for keywords

keywords such as <code>for</code> and <code>if</code> can omit their brackets (as long as the statement does not become amiguous). 
The brackets are inserted either before a newline, a left brace '{' or a comma (for one liners)

<pre>
// for
for i in A
  run A[i]

// if
if name == "john", return false

// while
while we_have_time { 
  run tasks 
}
</pre>
