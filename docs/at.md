
## <code>@</code> and <code>@@</code>

This module provides an Ruby style aliases for:

* <code>this</code> in the form of <code>@</code>
* <code>this.constructor</code> in the form of <code>@@</code>


### Example

<pre>
Animal = (type, color) {
  @type = type
  @color = color
  @@count += 1
  @@all.push @
}
</pre>

## @ in bang function calls

In the case of unwrapped async calls via the <code>bang</code> postfix, <code>@</code> will actually refer to the outer <code>this</code>. 

Since we can refer to both via this method, binding becomes unecessary. 


### Example

<pre>
Class.cacheData = {
  d = $.get! "/" 
  @data = d      // outer this
  this.data = d  // inner this
  return @
}
</pre>