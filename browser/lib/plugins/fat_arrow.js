require.module('./plugins/fat_arrow', function(exports, require) {
// start module 

/*

bind: -> 
  $("#click").click =>
    this.hello()
    
    $(this).unbind =>
      this.hello()

bind: -> 
  var _this = this
  $("#click").click ->
    _this.hello()
    $("#click").click ->
      _this.hello()

*/


// end module
})