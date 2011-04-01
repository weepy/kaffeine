## String Extensions


### multiline strings

Allows for multiline strings:

<pre>
list = "1. Eggs
2. SOY SAUCE
3. Milk
"
</pre>

It maintains newlines, but this can be suppressed with the \ character (which conveniently provides parity with normal javascript)

<pre>
html = "1. Eggs \
2. SOY SAUCE \
3. Milk "
</pre>


### String Interpolation

This module provides ruby style string interpolation via #{} within double quoted strings

<pre>
name = "#{first} #{second}"
age = "#{this_year - birth_year}"
</pre>
This following example uses both multiline and string interpolation at once

<pre>
letter = "Dear #{name},
I am writing to you to inform you of #{purpose}
Kind Regards
#{sender}
"
</pre>

To surpress the interpolation use \\#, or single quoted strings:

<pre>
a = "\#{hello}"
b = '#{hello}'
</pre>

