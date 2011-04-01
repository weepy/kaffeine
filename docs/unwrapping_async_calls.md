### Unwrapping async calls with '!'

A ! postfix to a function call signals to Kaffeine that this is an unwrapped async call masquerading as a normal function call.
Kaffeine will recompile it into a normal function call with the follow code wrapping into an async callback.

h4 Here is simple example

<pre>
// simple call
fish = $.get! '/fish'     
$("stomach").append fish

// another simple call with implied ()
ok = stomach.save!        
meal.complete = ok
</pre>

This is super useful for simplifying nested asynchronous calls (esp with nodejs) and works nicely in a number of scenarios:

<pre>
// create convenient sleep function
sleep = { setTimeout #1, #0 }

// use it
test_check = {
  if !@chess.isCheck() {
    sleep! 400
    alert "STALEMATE"
  }
}
</pre>

<pre>
// assignment from multi argument callback
x = {
  err, x = $.get! "/"
  if !err, process x
}
</pre>

<pre>
// three async calls unwrapped in series
app.get "/stats", (req, res) {
  res.send {
    user_count: User.count!,
    task_count: Task.count!,
    pending_tasks: Task.count! "pending",
  }
}

</pre>

<pre>
// if clause and as a function parameter
handle = (callback) {
  if valid_session! @ {
    callback get_session!
  } else 
    callback false
}
</pre>

### When does the function unwrapping 'stop'? 

* at an unmatched right bracket (e.g. the end of a function or arg list), 
* The end of the file
* Or the <code>---</code> operator - added for completeness, but I have never actually needed it.

<pre>
x = {
  result = shoot! user1
  if result, user1.die!
  ---
  result = shoot! user2
  if result, user.die!
  ---
  result = shoot! user3
  if result, user.die!
  ---
}
</pre>