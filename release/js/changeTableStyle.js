$(function(){
	// tableが画面からはみ出る場合は$targetにクラスを追加
	function main(){
		var $target     = $('table');
		var windowWidth = $(window).innerWidth();
		var wrapWidh    = Math.floor(windowWidth - windowWidth*0.04);

		for (var i=0; i<$target.length; i++) {
			try { $target[i].classList.remove('scroll', '-border'); } catch (e) { }
			var targetWidth = $target[i].offsetWidth;

			if (wrapWidh < targetWidth) {
				var isBorder = $target[i].style.border;
				if ($target[i].border == 0) { $target[i].classList.add('-border'); }
				$target[i].classList.add('scroll');
			}
		}
	}

	$(window).on('load', function() { main(); });

	var timer = 0;
	$(window).on('resize', function() {
		if (timer > 0) {
			clearTimeout(timer);
		}
		timer = setTimeout(function () {
			main();
		}, 200);
	});

	// URLに記事の番号を付ける！ ////////////////////////////////////////////////
	var paramsArray  = [];
	var $breadcrumbsTarget   = $('.breadcrumbsWrap .text.link:nth-child(3)');
	var $breadcrumbsTarget02 = $('.entryArea .toBackLink');
	var breadcrumbsText = '年のお知らせ';
	var currentParam = location.search.substring(1);
	var newsYear  = $('.articleItems .leftArea .date time').text();
		newsYear.replace(/\d{4}/, function(year){newsYear = year;});

	var param = currentParam.split('&');
	for (var i=0; i<param.length; i++) {
		var paramItem = param[i].split('=');
		paramsArray[paramItem[0]] = paramItem[1];
	}

	if (!currentParam) {
		  $breadcrumbsTarget.attr('href', 'index.html?year=' + newsYear).text(newsYear + '年のお知らせ');
		$breadcrumbsTarget02.attr('href', 'index.html?year=' + newsYear).text('お知らせ ' + newsYear + '年 一覧へ');
	} else if (!paramsArray.year) {
		  $breadcrumbsTarget.attr('href', 'index.html?' + currentParam + '&year=' + newsYear).text(newsYear + '年のお知らせ');
		$breadcrumbsTarget02.attr('href', 'index.html?' + currentParam + '&year=' + newsYear).text('お知らせ ' + newsYear + '年 一覧へ');
	} else {
		  $breadcrumbsTarget.attr('href', 'index.html?' + currentParam).text(newsYear + '年のお知らせ');
		$breadcrumbsTarget02.attr('href', 'index.html?' + currentParam).text('お知らせ ' + newsYear + '年 一覧へ');
	}
});