#class class_part2 super

class Animal {

}

class Mammal(legs) extends Animal {
  super
  this.legs = legs  
  
  this.isBiped = function() {
    return this.legs == 2
  }
}

Mammal.prototype.isQuadraped = function() {
   return this.legs == 4
}

class Human extends Mammal {
  super(2)
}

var h = new Human()

var m = new Mammal(4)

ok(m.isQuadraped())
ok(h.isBiped())