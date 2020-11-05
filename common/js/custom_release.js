// JavaScript Document

// グローバルナビ メガドロップ //
$(function(){
  $(".g_nav > ul > li").hover(function(){
    $(this).find(".mdd_inner").stop().slideDown("fast");
  },function(){
    $(this).find(".mdd_inner").stop().slideUp("fast");
  });
});

// グローバルナビ トップのみスクロールしたら縮む //
(function($) {
    $(function() {
        var $header = $('#top_header');
        $(window).scroll(function() {
            if ($(window).scrollTop() > 50) {
                $header.addClass('fixed');
            } else {
                $header.removeClass('fixed');
            }
        });
    });
})(jQuery);

// ハンバーガーメニュー //
$(function(){
        var sp_nav = $('.header_nav');
        var nav =$('.h_nav');
        var main_cover = $('.main_cover');


        sp_nav.on('click',function(){
            nav.slideToggle();
            sp_nav.toggleClass('active');
            main_cover.toggleClass('active');

            if(sp_nav.hasClass('active')){
                main_cover.on('click',function(){
                    sp_nav.removeClass('active');
                    main_cover.removeClass('active');
                    nav.slideUp();
                });
            }
        });

});


// メニューアクティブ
$(document).ready(function() {
    var activeUrl = location.pathname.split("/")[1];
      navList = $(".g_nav .menu_li li").find("a.menu_category");
 
    navList.each(function(){
        if( $(this).attr("href").split("/")[1] == activeUrl ) {
         $(this).addClass("active");
       };
  });
});