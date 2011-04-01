## for loop extensions

This module adds additional functionality to the <code>of</code> loop:

<code>of</code> operator for looping through arrays. The first parameter will refer to the element itself, and an optional 2nd paramter will refer to the index:

<pre>
A = [7,3,4]

// will log 14
for x of A
  sum += x
  
log sum     

// will log 3
for x, i of A
  sum += i
log sum
</pre>


Kaffeine also provides a second optional second parameter for the <code>in</code> keyword, containing the value:

<pre>
A = [7,3,4]
z = ""

// will log 734
for key, val in A
  zip += val

</pre>

