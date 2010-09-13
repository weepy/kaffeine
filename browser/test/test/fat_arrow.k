# fat_arrow arrow

this.val = 2

y = -> { 
  return this.val + 1 
}

nofat = -> {
  return (-> {
    return y()
  })()
}

fat = -> {
  return (=> {
    return y.call(this)
  })()
}


var context = {val: 1}

eq(nofat.call(context), 3)
eq(fat.call(context), 2)