
function ok(x, s) { 
  s = s || ""
  x 
    ? pass(s)  
    : fail(s)
}


function eq(a, b, s) { 
  s = s || ""
  if(a===b) 
    pass(s) 
  else
    fail(a,"!=",b)
  } 

function same(a,b,s) {
  s = s || ""
  function _same(a,b) {
    for(var i in a)
      if(b[i] !== a[i]) return false
    for(var i in a)
      if(b[i] !== a[i]) return false
    return true
  }

  _same(a, b) 
    ? pass(s) 
    : fail(a, "!=", b)
}

function reset() {
  results.pass = []
  results.fail = []
}

function pass() {
  results.pass.push(1)
}

function fail() {
  console.warn("Fail: " + Array.prototype.slice.call(arguments,0).join(", "))
  results.fail.push(1)
}

var results = {pass: [], fail: []}

exports.assert = {
  ok: ok,
  eq: eq,
  same: same,
  reset: reset,
  results: results
}