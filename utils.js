function trim(s) {
  return s.replace(/^\s*/,"").replace(/\s*$/,"")
}

function log() {
  if(typeof console != "undefined")
    console.log.apply(this, arguments)
}