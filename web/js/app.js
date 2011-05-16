$().ready(function() {
  $("textarea").each(function() {
    var x = $(this).html()
    $(this).replaceWith($("<pre>" + x + "</pre>"))
  })
  
  $(window).sausage({page: "h2, h3"});
  
})

// (function(){
//     /*
//         This first part is just throwaway code to simulate a lazy loaded page.
//     */
//     var pages = [],
//         ran = 5,
//         $pages = $('.page-set'),
//         i = 0,
//         index = 0,
//         loading = false;
//     function addPage() {
//         var h_page = (Math.floor((1000-499)*Math.random()) + 500)
//         $pages
//             .append('<li class="page" style="height:' + h_page + 'px;">Page ' + (index + 1) + '</li>')
//             ;
//         index ++;
//     };
//     for (i = 0; i < ran; i++)
//     {
//         addPage(i);
//     }
//     $(window).scroll(function(){
//         if (loading)
//         {
//             return;
//         }
//         if  ($(window).scrollTop() > $(document).height() - $(window).height() - 200)
//         {
//             loading = true;
//             setTimeout(function(){
//                 addPage();
//                 $(window)
//                     .sausage('draw')
//                     ;
//                 loading = false;
//             }, 250);
//         }
//     });
//     /*
//         This is where the plugin is initialized.
//     */
// 
//     function t() {  
//         var time = new Date();  
//         return time.getTime();  
//     }
//     var s = t();   
//     for (var i = 0; i < 50; i++)
//     {  
//         $(window)
//             .sausage('draw')
//             ;
//     }
//     $('#out').append((t() - s) + 'ms');
// }());