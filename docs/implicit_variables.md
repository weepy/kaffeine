## Implicit Variables

This module provides support for omitting the var keyword: the variables will be automagically defined in the closest relevant closure.

Examples

<pre>
x = 1, a = 3
{
  x = 2
  y = 2
}
</pre>


The <code>var</code> will be pulled to the top of the current closure:
<pre>
{
  x = 2
  var x
}
</pre>

