// JavaScript Document

// ローディング //
/* window.onload = function(){
    $(function() {
        $("#loader-bg").fadeOut();
        $("#loading").fadeOut();
    });
} */
$(function() {
    var h = $(window).height();
    $('#loader-bg ,#loading').height(h).css('display','block');
});

$(window).load(function() {
    $('#loader-bg').delay(1000).fadeOut(800);
	$('#loading').delay(800).fadeOut(300);
});

/* $(function(){
    setTimeout('stopload()',10000);
}); */

// 背景youtube読み込み //
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var youTubeId = '3pA6I_IUm8g'
 
function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player(
   'player',
    {
      videoId: youTubeId,
        playerVars: {
          rel : 0,
          controls : 0,
          autoplay : 1,
          mute : 1,
          loop : 1,
          playlist : youTubeId,
          showinfo : 0
       },
       events: {
        'onReady': onPlayerReady
      }
    }
  );
}

function onPlayerReady(event) {
  var player = event.target
  event.target.mute();
  event.target.playVideo();
}

// スマホ用スライド //
function slideSwitch() {
    var $active = $('#slideshow p.active');

    if ( $active.length == 0 ) $active = $('#slideshow p:last');

    var $next =  $active.next().length ? $active.next()
        : $('#slideshow p:first');

    $active.addClass('last-active');

    $next.css({opacity: 0.0})
        .addClass('active')
        .animate({opacity: 1.0}, 1500, function() {
            $active.removeClass('active last-active');
        });
}

$(function() {
    setInterval( "slideSwitch()", 5000 );
});


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



// 事業内容スライダー
	$(function(){
		$('.service_r_img').infiniteslide({
			speed: 50,
			direction: 'right',
			pauseonhover: false
		});
		$('.service_l_img').infiniteslide({
			speed: 50,
			direction: 'left',
			pauseonhover: false
		});
	});
