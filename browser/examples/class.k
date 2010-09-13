// simple O-O class
class Animal {
  // @@ is a shortcut to this.constructor
  @@count += 1
}

// inheritence
class Mammal(legs) extends Animal
  // @ is a shortcut to this
  @legs = legs
  super()  // calls the method on the super class

// :: is a shortcut to this.prototype
Mammal::isBiped = ->
  @legs == 2

// the class here is implied by the last defined class or prototype
::isQuadraped = ->
   @legs == 4
