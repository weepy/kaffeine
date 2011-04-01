#class indented_blocks class_part2

class Animal {}

class Mammal(legs) extends Animal {
  this.legs = legs  
}

Mammal.prototype.isBiped = function() {
  return this.legs == 2
}


Mammal.prototype.isQuadraped = function() {
   return this.legs == 4
}

class Human extends Mammal
  this.legs = 2

h = new Human()
m = new Mammal(4)

ok(m.isQuadraped())
ok(h.isBiped())