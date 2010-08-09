require.module('lib/assert', function(exports, require) {
//////////////////////



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
  results = {pass: [], fail: []} 
}

function pass() {
  results.pass.push(arguments)
}

function fail() {
  results.fail.push(arguments)
}

var results = {pass: [], fail: []}

exports.assert = {
  ok: ok,
  eq: eq,
  same: same,
  reset: reset,
  results: results
}


/////////////////////////
})