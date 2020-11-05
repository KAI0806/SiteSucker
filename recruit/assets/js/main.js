

/* main
----------------------------------------------- */

const useragent		= window.navigator.userAgent;
const dombody			= "html,body";
const wheelevent	= "onwheel" in document ? "wheel":"onmousewheel" in document ? "mousewheel":"DOMMouseScroll";
const is_touch		= (useragent.match(/(iPhone|iPod|iPad|Android)/i)) ? true:false;
const is_tablet		= (useragent.match(/(iPad|Android)/i) && !useragent.match(/(Android.*Mobile)/i)) ? true:false;
const is_android	= (useragent.match(/(Android)/i)) ? true:false;
const is_oldie		= (useragent.match(/(MSIE 6|MSIE 7|MSIE 8|MSIE 9|MSIE 10)/i)) ? true:false;
const is_ie11			= (useragent.match(/(rv:11)/i)) ? true:false;
const is_edge			= (useragent.match(/(Edge)/i)) ? true:false;
const is_ab				= ((/Android/.test(useragent) && /Linux; U;/.test(useragent) && !/Chrome/.test(useragent)) || (/Android/.test(useragent) && /Chrome/.test(useragent) && /Version/.test(useragent)) || (/Android/.test(useragent) && /Chrome/.test(useragent) && /SamsungBrowser/.test(useragent))) ? true:false;
const breakpoint	= 1000;

var is_mobile = (window.innerWidth < breakpoint) ? true:false;
var debug = 1;

$window = $(window);
$body = $("body");
$loading = $(".js-loading");
$pageup = $(".js-pageup");
$header = $(".js-header");
$nav = $(".js-nav");


/* ready
----------------------------------------------- */

$(function() {
	
	wheel.ready();
	flick.ready();
	resize.ready();
	scroll.ready();
	srcswap.ready();
	pageup.ready();
	anchor.ready();
	modal.ready();
	
	contentsfix.ready();
	nav.ready();

	loading.ready();

});


/* wheel
----------------------------------------------- */

var wheel = {
	ready:function() {

		wheel.flag = false;

		$window.on(wheelevent, wheel.start);

	},
	start:function(event) {

		if (wheel.flag) {

			if (event.preventDefault) {

				event.preventDefault();

			}

			event.returnValue = false;

		}
		else {

			$(dombody).stop();

		}

	}
};


/* flick
----------------------------------------------- */

var flick = {
	ready:function() {

		flick.flag = false;

		document.body.addEventListener("touchmove", flick.start, { passive:false });

	},
	start:function(event) {

		if (flick.flag) {
			event.preventDefault();
		}

	}
};


/* resize
----------------------------------------------- */

var resize = {
	ready:function() {
		
		resize.params = new Object();
		resize.width = window.innerWidth;
		resize.height = window.innerHeight;
		resize.body = Math.max.apply(null, [document.body.clientHeight , document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight]);

		$window.on("resize", resize.start);
		
		resize.start();

	},
	start:function() {

		clearInterval(resize.interval);
		
		resize.interval = setInterval(resize.end, 50);
				
	},
	end:function() {

		clearInterval(resize.interval);

		is_mobile = (window.innerWidth < breakpoint) ? true:false;
		
		if (is_mobile) {

			if (resize.width != window.innerWidth) {
	
				for (var i in resize.params) {
					resize.params[i]();
				}

				resize.width = window.innerWidth;
				
			}
			
		}
		else {

			for (var i in resize.params) {
				resize.params[i]();
			}

			resize.width = window.innerWidth;

		}

		resize.height = window.innerHeight;
		resize.body = Math.max.apply(null, [document.body.clientHeight , document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight]);
		
	}
}


/* scroll
----------------------------------------------- */

var scroll = {
	ready:function() {
		
		scroll.params = new Object();
		scroll.current = 0;
		scroll.top = 0;
		
		$window.on("scroll", scroll.start);
		
		scroll.start();
		scroll.loop();
		
	},
	start:function() {

		scroll.top = $window.scrollTop();
		
	},
	loop:function() {
		
		if (scroll.current != scroll.top) {
			
			for (var i in scroll.params) {
				scroll.params[i]();
			}
			
			scroll.current = scroll.top;

		}

		requestAnimationFrame(scroll.loop);
		
	}
};


/* srcswap
----------------------------------------------- */

var srcswap = {
	ready:function() {
		
		resize.params.srcswap = srcswap.resize;
		
		srcswap.resize();
		
	},
	resize:function() {

		$(".srcswap").each(function() {
				
			let src = $(this).attr("src");
			let srcset = $(this).attr("srcset");
			
			if (is_mobile) {
				
				src = src.replace(/_pc/g, "_sp");
				srcset = srcset.replace(/_pc/g, "_sp");
				
			}
			else {

				src = src.replace(/_sp/g, "_pc");
				srcset = srcset.replace(/_sp/g, "_pc");
				
			}

			$(this).attr("src", src);
			$(this).attr("srcset", srcset);

		});
		
	}
};


/* pageup
----------------------------------------------- */

var pageup = {
	ready:function() {
		
		$pageup.on("click", pageup.start);
		
	},
	start:function() {
		
		$(dombody).stop().animate({ scrollTop:0 }, 800, "easeInOutExpo");
		
	}
};


/* anchor
----------------------------------------------- */

var anchor = {
	ready:function() {

		$(".js-anchor").on("click", anchor.start);

	},
	start:function() {
		
		let hash = $(this).attr("href");
		let posi = ($(hash).length > 0) ? $(hash).offset().top:0;
		
		posi -= $header.height();
		
		console.log($header.height());
		
		$(dombody).stop().animate({ scrollTop:posi }, 800, "easeInOutExpo");
		
		return false;
		
	}
};


/* modal
----------------------------------------------- */

var modal = {
	ready:function() {

		if (debug) {

			//$(".js-modal-window").show();

		}
		else {
		
			$(".js-modal-window").addClass("js-modal-ready");
	
			$(".js-modal").on("click", modal.open);
		
		}
		
	},
	open:function() {

		let src = $(this).data("src");
		
		modal.target = $(this).data("modal");
		
		if (src) {
			$("." + modal.target).find("iframe").attr("src", src);
		}
		
		$(this).off("click");

		wheel.flag = true;
		flick.flag = true;

		setTimeout(modal.start, 25);
		
		return false;
		
	},
	close:function() {

		$(this).off("click");

		$("." + modal.target).removeClass("js-modal-start");

		setTimeout(modal.end, 500);

		return false;
		
	},
	start:function() {
				
		$("." + modal.target).addClass("js-modal-start");

		$(".js-modal-start").on("click", modal.close);
		$(".js-modal-start .modal__inner").children("div").on("click", modal.cancel);
		
	},
	end:function() {

		$("." + modal.target).find("iframe").attr("src","");
		
		$(".js-modal").off("click").on("click", modal.open);

		wheel.flag = false;
		flick.flag = false;

		return false;

	},
	cancel:function(event) {

		event.stopPropagation();
		
	}
};


/* sitemap
----------------------------------------------- */

var sitemap = {
	ready:function() {
		
		resize.params.sitemap = sitemap.resize;
		
		sitemap.resize();
		
	},
	resize:function() {

		$(".js-sitemap-accordion").clearQueue().stop().show();
		$(".js-sitemap-arrow").off("click touchstart");

		if (is_mobile) {

			$(".js-sitemap-accordion").clearQueue().stop().hide();

			if (is_touch) {
				$(".js-sitemap-arrow").on("touchstart", sitemap.toggle);
			}
			else {
				$(".js-sitemap-arrow").on("click", sitemap.toggle);
			}
			
		}
		
	},
	toggle:function() {
		
		$(this).toggleClass("js-sitemap-arrow-open");
		$(this).next().clearQueue().stop().slideToggle(350, "easeInOutExpo");
		
	}
};


/* parallax
----------------------------------------------- */

var parallax = {
	ready:function() {
		
		parallax.params = new Array();
		
		$(".js-parallax").each(function() {
			
			parallax.params.push({ flag:true, elem:$(this), offset:$(this).offset().top, height:$(this).height() });
			
			$(this).addClass("js-parallax-ready");
			
		});

	},
	start:function() {

		resize.params.parallax = parallax.resize;
		scroll.params.parallax = parallax.scroll;
		
		parallax.resize();
		
	},
	resize:function() {
		
		for (let i in parallax.params) {

			let flag = parallax.params[i].flag;
			let elem = parallax.params[i].elem;

			parallax.params[i].offset = $(elem).offset().top;
			parallax.params[i].height = $(elem).height();

		}
		
		parallax.scroll();
		
	},
	scroll:function() {
		
		let scrolltop = scroll.top + (resize.height / 4 * 3);
		
		// parallax start

		for (let i in parallax.params) {

			let flag = parallax.params[i].flag;
			let elem = parallax.params[i].elem;
			let offset = parallax.params[i].offset;
			let height = parallax.params[i].height;
			
			if (flag && scrolltop >= offset) {

				$(elem).addClass("js-parallax-start");

				parallax.params[i].flag = false;

			}

		}

	}
};


/* contentsfix
----------------------------------------------- */

var contentsfix = {
	ready:function() {
		
		contentsfix.flag = true;
		
		resize.params.contentsfix = contentsfix.resize;
		
		contentsfix.resize();
		
	},
	resize:function() {

		contentsfix.end();

	},
	start:function() {

		if (contentsfix.flag) {
			
			let posi = $window.scrollTop();
	
			$body.css({ position:"fixed", top:-posi, width:"100%" });
			
			contentsfix.flag = false;

		}

	},
	end:function() {

		if (!contentsfix.flag) {
		
			let posi = $body.position().top * -1;
	
			$body.css({ position:"static", top:0, width:"auto" });
					
			if (posi != 0) $window.scrollTop(posi);

			contentsfix.flag = true;
		
		}

	}
};


/* nav
----------------------------------------------- */

var nav = {
	ready:function() {
		
		nav.flag = true;
		
		resize.params.nav = nav.resize;
		
		nav.resize();

	},
	resize:function() {

		$nav.off("click");
		$nav.removeClass("js-nav-open");

		$nav.find(".nav__column").off("click");
		$nav.find(".nav__items").off("click");
		$nav.find(".nav__submenu").clearQueue().stop().show();

		$(".js-nav-column").removeClass("js-nav-column-open");
		$(".js-nav-column").off("click");
		$(".js-nav-control").off("click");

		if (is_mobile) {

			delete scroll.params.nav;

			$(".js-nav-column").off("click").on("click", nav.menu.toggle);
			$(".js-nav-column .nav__submenu").off("click").on("click", nav.cancel);
			$(".js-nav-control").off("click").on("click", nav.menu.open);
			$(".js-nav-item-anchor").off("click").on("click", nav.menu.anchor);

		}
		else {

			$nav.off("click").on("click", nav.guide.close);
			$nav.find(".nav__column").off("click").on("click", nav.cancel);
			$nav.find(".nav__items").off("click").on("click", nav.cancel);
			$nav.find(".sns").off("click").on("click", nav.cancel);

			$(".js-nav-column").off("click").on("click", nav.guide.open);
			$(".js-nav-item-anchor").off("click").on("click", nav.guide.anchor);

			scroll.params.nav = nav.scroll;

			nav.scroll();

		}

	},
	guide:{
		open:function() {
			
			nav.guide.close();

			$nav.addClass("js-nav-open");

			$(this).addClass("js-nav-column-open");
			$(this).off("click").on("click", nav.guide.close);
			
			return false;

		},
		close:function() {

			$nav.removeClass("js-nav-open");

			$(".js-nav-column").removeClass("js-nav-column-open");
			$(".js-nav-column").off("click").on("click", nav.guide.open);

			return false;

		},
		anchor:function() {
			
			setTimeout(nav.guide.close, 250);
			
		}
	},
	menu:{
		open:function() {

			$nav.addClass("js-nav-open");
			$nav.find(".nav__submenu").clearQueue().stop().hide();

			$(".js-nav-column").removeClass("js-nav-column-open");
			$(".js-nav-control").off("click").on("click", nav.menu.close);

			contentsfix.start();

			return false;
			
		},
		close:function() {

			$nav.removeClass("js-nav-open");

			$(".js-nav-control").off("click").on("click", nav.menu.open);

			contentsfix.end();

			return false;

		},
		toggle:function() {

			$(this).toggleClass("js-nav-column-open");

			$(this).find(".nav__submenu").clearQueue().stop().slideToggle(250, "easeInOutQuart");

			return false;

		},
		anchor:function() {
			
			nav.menu.close();
			
		}
	},
	scroll:function() {

		if (nav.flag && scroll.top >= $header.height()) {
			
			$header.addClass("js-header-mini");
			$nav.addClass("js-nav-mini");
			
			nav.flag = false;
			
		}
		else if (!nav.flag && scroll.top < $header.height()) {

			$header.removeClass("js-header-mini");
			$nav.removeClass("js-nav-mini");
			
			nav.flag = true;

		}

	},
	cancel:function(event) {

		event.stopPropagation();
		
	}
}


/*
var nav = {
	ready:function() {
		
		nav.flag = true;
		
		resize.params.nav = nav.resize;
		
		nav.resize();		
		
	},
	resize:function() {

		nav.close();

		$nav.off("click");
		$nav.find(".nav__items").off("click");

		$nav.removeClass("js-nav-open");
		$nav.find(".js-nav-column").removeClass("js-nav-column-open");
		$nav.find(".nav__submenu").show();

		delete scroll.params.nav;

		if (is_mobile) {

			$nav.find(".js-nav-column").find(".nav__submenu").hide();
			
			$(".js-nav-control").off("click").on("click", nav.open);
			
		}
		else {

			$nav.off("click").on("click", nav.close);
			$nav.find(".nav__column").off("click").on("click", nav.cancel);
			$nav.find(".nav__items").off("click").on("click", nav.cancel);
			
			$(".js-nav-column").off("click").on("click", nav.open);

			scroll.params.nav = nav.scroll;

			nav.scroll();

		}
		
	},
	scroll:function() {

		if (nav.flag && scroll.top >= $header.height()) {
			
			$header.addClass("js-header-mini");
			$nav.addClass("js-nav-mini");
			
			nav.flag = false;
			
		}
		else if (!nav.flag && scroll.top < $header.height()) {

			$header.removeClass("js-header-mini");
			$nav.removeClass("js-nav-mini");
			
			nav.flag = true;

		}

	},
	open:function() {
		
		nav.close();
		
		$nav.addClass("js-nav-open");

		$(this).addClass("js-nav-column-open");

		$(this).off("click").on("click", nav.close);

		if (is_mobile) {
			$nav.find(".js-nav-column").off("click").on("click", nav.toggle);
			$nav.find(".nav__submenu").clearQueue().stop().hide();
		}

		contentsfix.start();
		
		return false;
		
	},
	close:function() {

		$nav.removeClass("js-nav-open");

		$nav.find(".js-nav-column").removeClass("js-nav-column-open");

		$(".js-nav-column").off("click").on("click", nav.open);
		$(".js-nav-control").off("click").on("click", nav.open);
		
		contentsfix.end();
		
		return false;
		
	},
	toggle:function() {
		
		$(this).toggleClass("js-nav-column-open");
		$(this).find(".nav__submenu").clearQueue().stop().slideToggle(250, "easeInOutQuart");
		
	},
	cancel:function(event) {

		event.stopPropagation();
		
	}
};
*/


/* intro
----------------------------------------------- */

var intro = {
	ready:function() {
		
		$intro = $(".js-intro");
		
		if (debug) return false;
		
		$intro.addClass("js-intro-ready");

		//scroll.params.intro = intro.scroll;
		
		//intro.scroll();
		
	},
	scroll:function() {

		let percent = scroll.top / resize.height * 100;
		let image_posi = ($intro.height() / 2) / 100 * percent;
		let title_posi = ($intro.height() / 3) / 100 * percent;
		
		$intro.find(".intro__images").css({ transform:"translateY(" + image_posi + "px)" });
		$intro.find(".intro__title img").css({ transform:"translateY(" + title_posi + "px)" });

	},
	start:function() {

		$intro.addClass("js-intro-start");
		
		//setTimeout(intro.slide.ready, 3000);
		
	},
	slide:{
		ready:function() {

			$intro.find(".intro__image").eq(0).addClass("js-intro-slide-ready");
			
			$intro.find(".intro__images").append($intro.find(".intro__image").eq(0));
	
			setTimeout(intro.slide.start, 1000);
			
		},
		start:function() {

			$intro.find(".intro__image").eq(0).removeClass("js-intro-slide-start");

			$intro.find(".intro__image").eq($intro.find(".intro__image").length - 1).addClass("js-intro-slide-start");

			setTimeout(intro.slide.ready, 5000);
			
		}
	}
};


/* accordion
----------------------------------------------- */

var accordion = {
	ready:function() {
		
		if (debug) return false;
		
		$(".js-accordion").find(".accordion__items").hide();
		$(".js-accordion").find(".accordion__category").on("click", accordion.toggle);
		
	},
	toggle:function() {

		$(this).toggleClass("js-accordion-category-open");
		$(this).next().clearQueue().stop().slideToggle(250, "easeInOutExpo");
		
	}
};


/* lightbox
----------------------------------------------- */

var lightbox = {
	ready:function() {

		$(".js-lightboxopen").on("click", lightbox.open);

	},
	open:function() {

		lightbox.data = lightboxdata[$(this).attr("href").replace(/#/, "")];
		lightbox.total = lightbox.data.length;
		lightbox.count = 0;
		lightbox.index = 0;
		
		var htmls = new Array();
		var html;

		htmls.push('		<div class="lightbox js-lightbox js-lightbox-ready">');
		htmls.push('			<div class="lightbox__based js-lightbox-based-ready">');
		
		htmls.push('				<div class="lightbox__loadings">');
		htmls.push('					<div class="lightbox__loading"></div>');
		htmls.push('				</div>');
		
		htmls.push('			</div>');
		htmls.push('			<div class="lightbox__close">');
		htmls.push('				<span class="lightbox__icon"><span>');
		htmls.push('			</div>');
		htmls.push('		</div>');

		html = htmls.join("");
		
		$body.append(html);
		
		$lightbox = $(".js-lightbox");
				
		setTimeout(lightbox.loading.start, 25);
		
		$(".js-lightbox").off("click");
		
		wheel.flag = true;
		
		contentsfix.start();

		return false;
		
	},
	close:function() {
		
		$lightbox.find(".lightbox__based").remove();
		$lightbox.fadeOut(250, function() {
			
			$(this).remove();

			$(".js-lightboxopen").off("click").on("click", lightbox.open);

		});

		wheel.flag = false;
		
		contentsfix.end();

		return false;
		
	},
	setup:function() {

		$lightbox.find(".lightbox__based").addClass("js-lightbox-based-start");
	
		$lightbox.find(".lightbox__image").on("click", lightbox.cancel);
		$lightbox.find(".lightbox__caption").on("click", lightbox.cancel);
		$lightbox.find(".lightbox__thumbnail").on("click", lightbox.cancel);
	
		$lightbox.find(".lightbox__caption .lightbox__item").eq(0).addClass("js-lightbox-item-current");
		$lightbox.find(".lightbox__thumbnail .lightbox__item").eq(0).addClass("js-lightbox-item-current");
	
		$lightbox.find(".lightbox__prev").on("click", lightbox.control);
		$lightbox.find(".lightbox__next").on("click", lightbox.control);

	},
	control:function(event, slick, currentSlide, nextSlide) {
		
		switch (this.className) {
			case "lightbox__prev":

				lightbox.index--;

			break;
			case "lightbox__next":

				lightbox.index++;

			break;
			default:
			
				lightbox.index = nextSlide;
				
			break;
		}

		if (lightbox.index > lightbox.total - 1) {
			lightbox.index = 0;
		}

		if (lightbox.index < 0) {
			lightbox.index = lightbox.total - 1;
		}

		lightbox.slide();

	},
	slide:function() {

		$lightbox.find(".lightbox__item").removeClass("js-lightbox-item-current");
		
		$lightbox.find(".lightbox__caption .lightbox__item").eq(lightbox.index).addClass("js-lightbox-item-current");
		$lightbox.find(".lightbox__thumbnail .lightbox__item").eq(lightbox.index).addClass("js-lightbox-item-current");
		
    $(".lightbox__image .lightbox__items").slick("slickGoTo", lightbox.index);

	},
	resize:function() {
		
		let set_height = $window.height() - 100 * 2 - 50;
		let set_width = 960 / 640 * set_height;
		
		if (is_mobile) {

			if (set_width > $window.width() - 40) {
				set_width = $window.width() - 40;
				set_height = 640 / 960 * set_width;
			}

		}
		else {

			if (set_width > $window.width() - 100) {
				set_width = $window.width() - 100;
				set_height = 640 / 960 * set_width;
			}

		}

		let margin_top = set_height / 2 + 75;
		let margin_left = set_width / 2;
		
		$lightbox.find(".lightbox__image").css({ marginTop:-margin_top, marginLeft:-margin_left, width:set_width, height:set_height });
		$lightbox.find(".lightbox__image img").css({ width:set_width, height:set_height });
		$lightbox.find(".lightbox__caption").css({ marginTop:set_height/2-50 });

	},
	loading:{
		start:function() {
			
			$lightbox.addClass("js-lightbox-start");

			$lightbox.on("click", lightbox.close);

			setTimeout(lightbox.loading.load, 500);
			
		},
		end:function() {

			$lightbox.addClass("js-lightbox-end");

			var htmls = new Array();
			var html;

			htmls.push('				<div class="lightbox__image">');
			htmls.push('					<div class="lightbox__inner">');
			htmls.push('						<div class="lightbox__items">');
			
			for (let i in lightbox.data) {
				
				let image = lightbox.data[i].image;

				htmls.push('							<div class="lightbox__item">');
				htmls.push('								<img src="' + image + '" alt="" width="960" height="640">');
				htmls.push('							</div>');
				
			}

			htmls.push('						</div>');
			htmls.push('					</div>');
			
			if (lightbox.total > 1) {
				htmls.push('					<div class="lightbox__prev"><span class="lightbox__icon"></span></div>');
				htmls.push('					<div class="lightbox__next"><span class="lightbox__icon"></span></div>');
			}
			
			htmls.push('				</div>');
			
			htmls.push('				<div class="lightbox__caption">');
			htmls.push('					<div class="lightbox__items">');

			for (let i in lightbox.data) {
				
				let caption = lightbox.data[i].caption;

				htmls.push('							<div class="lightbox__item">');
				htmls.push('								' + caption);
				htmls.push('							</div>');
				
			}

			htmls.push('					</div>');
			htmls.push('				</div>');

			if (lightbox.total > 1) {
			
				htmls.push('				<div class="lightbox__thumbnail">');
				htmls.push('					<div class="lightbox__inner">');
				htmls.push('						<div class="lightbox__items">');
	
				for (let i in lightbox.data) {
					
					let image = lightbox.data[i].image;
	
					htmls.push('							<div class="lightbox__item">');
					htmls.push('								<img src="' + image + '" alt="" width="960" height="640">');
					htmls.push('							</div>');
					
				}
	
				htmls.push('						</div>');
				htmls.push('					</div>');
	
				if (lightbox.total > 1) {
					htmls.push('					<div class="lightbox__prev"><span class="lightbox__icon"></span></div>');
					htmls.push('					<div class="lightbox__next"><span class="lightbox__icon"></span></div>');
				}
				
				htmls.push('				</div>');

			}

			html = htmls.join("");
			
			$lightbox.find(".lightbox__based").append(html);

			$(".lightbox__image .lightbox__items").slick({ asNavFor:".lightbox__thumbnail .lightbox__items", infinite:false, arrows:false, dots:false });
			$(".lightbox__thumbnail .lightbox__items").slick({ asNavFor:".lightbox__image .lightbox__items", infinite:false, arrows:false, dots:false, centerMode:true, variableWidth:true, focusOnSelect:true });
			$(".lightbox__image .lightbox__items").off("beforeChange").on("beforeChange", lightbox.control);
			
			resize.params.lightbox = lightbox.resize;
			
			lightbox.resize();

			setTimeout(lightbox.setup, 500);

		},
		load:function() {
			
			var img = new Image();
			var src = lightbox.data[lightbox.count].image;
			
			img.src = src;
			
			$(img).on("load", function() {
				
				lightbox.count++;
				
				let percent = lightbox.count / lightbox.total * 100;
				
				$lightbox.find(".lightbox__loading").css({ width:percent + "%" });
				
				if (lightbox.count < lightbox.total) {
					
					setTimeout(lightbox.loading.load, 25);
					
				}
				else {

					setTimeout(lightbox.loading.end, 250);
					
				}
				
				$(this).off("load");
				$(this).remove();
				
			});

		}
	},
	cancel:function(event) {
		
		event.stopPropagation();
		
	},
};


/* loading
----------------------------------------------- */

var loading = {
	ready:function() {
		
		loading.images = new Array();
		loading.total = 0;
		loading.count = 0;

		$("img").on("error", function() {
			
			$loading.hide();
			
			return false;
			
		});

		if (debug) {
			
			$loading.hide();

		}
		else {
			
			if (window.devicePixelRatio == 2) {

				$("img").each(function(i) {
					
					if ($(this).attr("srcset")) {
						
						var imgs = $(this).attr("srcset").split(",");
						var src = imgs[1].replace(" 2x", "");
						
					}
					else {

						var src = $(this).attr("src");
						
					}

					loading.images.push(src);
		
					loading.total++;
					
				});
				
			}
			else {

				$("img").each(function(i) {
					
					var src = $(this).attr("src");
					
					loading.images.push(src);
		
					loading.total++;
					
				});

			}
			
			if (loading.total > 0) {

				loading.start();
				
			}
			else {

				loading.end();
				
			}

			parallax.ready();
			
			wheel.flag = true;
			flick.flag = true;

		}

	},
	start:function() {
		
		var img = new Image();
		var src = loading.images[loading.count];

		img.src = src;
		
		$(img).on("load", function() {

			loading.count++;

			var percent = loading.count / loading.total * 100;
			
			$loading.find(".loading__bar-progress").css({ width:percent + "%" });

			if (loading.count >= loading.total) {

				setTimeout(loading.end, 250);

			}
			else {

				setTimeout(loading.start, 15);

			}

		});

	},
	end:function() {

		$loading.addClass("js-loading-end");
		
		setTimeout(function() {

			wheel.flag = false;
			flick.flag = false;
		
			$loading.remove();
			
		}, 1000);

		setTimeout(parallax.start, 500);

		loading.callback();

	},
	callback:function() {
	}
};

