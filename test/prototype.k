#class prototype

class Animal() {

}

::fast = function() { return this.speed > 100 }
::alive = true

class Mammal extends Animal {

}

::legs = function() { return 4 } 
Mammal::lungs = true

var m = new Mammal()
ok(m.lungs)
ok(m.alive)
eq(m.legs(),4)
var a = new Animal()
a.speed = 101
ok(a.fast())
