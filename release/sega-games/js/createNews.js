$(function(){

var hasDoneJson   = false;
var jsonDataArray = [];

var hasNews    = true;
var numNews    = 10; // 記事の表示件数
var articleNum = 0;


var hasParam       = false;
var showedArticles = false;

var latestYear;
var firstYear  = 2015; // 西暦の最小値
var currentYear;
var currentCate; // 数字
var currentCate02; // 文字

var pagerNum        = 1; // ページャーの数字の最大数
var currentPagerNum = 1;// 現在選択されているページャーの数字

var $moreButton     = $('.button.toNewsPage');
var $categoryButton = $('.newsNavCategory .navCategory');


function createNews(){
	var $tagnewsList = $('.newsListWrap');

	var numNewsMax = jsonDataArray.length;

	var newsCount = 0;
	var ulCount   = 0;
	var $tagUl = $('<ul>');
	for (var i=0; i<numNewsMax; i++) {
		newsCount++;
		var $tagNewsWrap = $('<a class="newsWrap">');
		var $tagCategory = $('<p class="category">');
		var $tagUpdated  = $('<p class="date">');
		var $tagDataTime = $('<time>');
		var $tagDivCf    = $('<div class="cf newsUpper">');
		var $tagText     = $('<p class="text">');
		var $tagLi       = $('<li>');

		var newsCategory = jsonDataArray[i].category;
		var newsUpdated  = jsonDataArray[i].updated;
		var newsTitle    = jsonDataArray[i].title;
		var newsURL      = jsonDataArray[i].targetUrl;

		var isOtherPage = jsonDataArray[i].isOtherPage;
		var isPdfPage   = jsonDataArray[i].isPdfPage;
		
		if (isPdfPage == 'true') {
			$tagNewsWrap = $tagNewsWrap.attr({
				'href': 'release/upload_images/' + newsURL,
				'target': '_blank'
			}).addClass('pdf');
		} else if (isOtherPage == 'true') {
			$tagNewsWrap = $tagNewsWrap.attr({
				'href': newsURL,
				'target': '_blank'
			});
		} else {
			$tagNewsWrap = $tagNewsWrap.attr({'href': newsURL + '?year=' + currentYear + '&category=' + currentCate + '&page=' + currentPagerNum});
		}


		$tagCategory = $tagCategory.text(newsCategory);
		switch (newsCategory){
			case '企業':
			  $tagCategory = $tagCategory.addClass('cate01');
			  break;
			case '製品・サービス':
			  $tagCategory = $tagCategory.addClass('cate02');
			  break;
			case '重要なお知らせ':
			  $tagCategory = $tagCategory.addClass('cate03');
			  break;
			default:
			  $tagCategory = $tagCategory.addClass('cate01');
			  break;
		}

		var timeValue = newsUpdated.replace(/年|月/g, '-');
		timeValue = timeValue.replace(/日/, '');
		$tagDataTime = $tagDataTime.attr({'datetime': timeValue}).text(newsUpdated);
		$tagUpdated  = $tagUpdated.append($tagDataTime);
		$tagText     = $tagText.text(newsTitle);

		$tagDivCf.append($tagCategory, $tagUpdated);
		$tagNewsWrap.append($tagDivCf, $tagText);
		$tagLi.append($tagNewsWrap);
		$tagUl.append($tagLi);

		if ( numNews == newsCount || (i+1)==numNewsMax) {
			ulCount++;
			pagerNum = ulCount;
			$tagUl.addClass('newsList').attr({'data-news': ulCount});
			$tagnewsList.append($tagUl);
			$tagUl = $('<ul>');
			newsCount = 0;
		}
	}

	//////////////////// ↓ ページャー実行 ////////////////////
	pagenation();
	hidePagerButton();
	//////////////////// ↑ ページャー実行 ////////////////////
}




function createNavSubYear(){
	var countNum = 1;
	var $tagNavLinks = $('<ul class="newsNavYear cf">');

	// SP版 //////////
	for (var i = latestYear; firstYear <= i; i--) {
		var $tagNavSubLink = $('<a>');
		var $tagNavSubWrap = $('.newsNavYearWrap');
		var $tagNavSubLi   = $('<li class="navYear">');
		var count02 = countNum++;

		if (hasNews && i==latestYear) {
				$tagNavSubLink.attr('href', 'index.html').text(i);
			} else {
				$tagNavSubLink.attr('href', 'index.html?year=' + i).text(i);
			}
		$tagNavSubLi.attr('data-year', i).append($tagNavSubLink);
		$tagNavLinks.append($tagNavSubLi);

		if (count02%4==0 || i==firstYear) {
			$tagNavSubWrap.append($tagNavLinks);
			var $tagNavLinks = $('<ul class="newsNavYear cf">');
		}
	}
}


function getParam(){
	var paramsArray  = [];
	var currentParam = location.search.substring(1);

	var param = currentParam.split('&');
	for (var i=0; i<param.length; i++) {
		var paramItem = param[i].split('=');
		paramsArray[paramItem[0]] = paramItem[1];
	}

	var paramYear = paramsArray.year;
	if (paramYear) {
		if (!paramYear.match(/^\d{4}$/)) {
			currentYear = latestYear;
		} else {
			currentYear = paramsArray.year;
		}
	} else {
		currentYear = latestYear;
	}


	currentPagerNum = paramsArray.page ? paramsArray.page : 1;

	switch (paramsArray.category){
		case '1':
		  currentCate = '1';
		  currentCate02 = '全て';
		  break;
		case '2':
		  currentCate = '2';
		  currentCate02 = '企業';
		  break;
		case '3':
		  currentCate = '3';
		  currentCate02 = '製品・サービス';
		  break;
		default:
		  currentCate = '1';
		  currentCate02 = '全て';
		  break;
	}

	var paramArticleNum = paramsArray.articleNum;

	if (paramArticleNum) {
		if (paramArticleNum.match(/^\d{1,3}$/)) {
			paramArticleNum = parseInt(paramArticleNum, 10);
			articleNum = paramArticleNum;
			showedArticles = true;
		}
	}

	hasParam = true;
}


function setUrlParaCate(category){
	if (currentYear == latestYear) {
		location.href = 'index.html?category=' + category + '&page=' + 1;
		return;
	}

	location.href = 'index.html?year=' + currentYear + '&category=' + category + '&page=' + 1;
}


function changeCurrentButton(){
	$categoryButton.removeClass('on');
	$('.newsNavCategory .navCategory[data-category="' + currentCate + '"]').addClass('on');

	$('.newsNavYear .navYear').removeClass('on');
	$('.newsNavYear .navYear[data-year="' + currentYear + '"]').addClass('on');

	$('.content_box h3 .year').text(currentYear + '年');
}



function getJson(){

	// 最新の記事の西暦を取得して、latestYearに格納
	function getLatestJson(){
		var defer02 = new $.Deferred;

		$.ajax({
			type: 'POST',
			url: 'js/news.json',
			dataType:'json',
			success: function(data){
				var newsYear = data.news[0].updated.replace(/年\d{1,2}月\d{1,2}日/g, '');
				latestYear = parseInt(newsYear);
				 if (!currentYear) { currentYear = latestYear; }

				defer02.resolve();
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.log('失敗', jqXHR + '-' + textStatus + '-' + errorThrown);
				defer02.reject();
			}
		});

		return defer02.promise();
	}


	// 現在の西暦の記事を取得
	function getCurrentJson(){
		latestYear == currentYear ? jsonURL = 'js/news.json' : jsonURL = 'js/news_' + currentYear + '.json';

		 var defer = new $.Deferred;

		$.ajax({
			type: 'POST',
			url: jsonURL,
			dataType:'json',
			success: function(data){
				for (var i=0; i<data.news.length; i++) {
					var thisCategory = data.news[i].category;

					if (thisCategory == currentCate02) { jsonDataArray.push(data.news[i]); }
					if (currentCate02 == '全て') { jsonDataArray.push(data.news[i]); }
				}
				defer.resolve();
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.log('失敗', jqXHR + '-' + textStatus + '-' + errorThrown);
				defer.reject();
			}
		});

		return defer.promise();
	}


getLatestJson().then(getCurrentJson).then(function(){
						hasDoneJson = true;
						createNews();
						createNavSubYear();
						changeCurrentButton();
					});
}





getParam();
if (hasParam) { getJson(); }


$categoryButton.on('click', function(){

	if (!hasDoneJson || $(this).hasClass('on')) { return; }

	var thisCategory = $(this).data('category');
	setUrlParaCate(thisCategory);
});

$('.newsNavYearWrap').on('click', 'a', function(event){
	if ($(this).parent().hasClass('on')) {
		event.preventDefault();
	}
});




function pagenation(){
	var obj = $('#pagination').twbsPagination({
		totalPages: pagerNum,
		visiblePages: 7,
		href: true,
		pageVariable: 'page',
		first: '<svg class="arrow morePrevArrow" viewBox="0 0 93.7 105.1"><path d="M53.7,21L21.5,52.6l32.3,31.6v21L0,52.6L53.7,0V21z M93.7,21L61.5,52.6l32.3,31.6v21L40,52.6L93.7,0V21z"></path></svg>',
		prev: '<svg class="arrow prevArrow" viewBox="0 0 53.7 105.1"><path class="st0" d="M53.7,21L21.5,52.6l32.3,31.6v21L0,52.6L53.7,0V21z"></path></svg>',
		next: '<svg class="arrow nextArrow" viewBox="0 0 53.7 105.1"><path class="st0" d="M53.7,21L21.5,52.6l32.3,31.6v21L0,52.6L53.7,0V21z"></path></svg>',
		last: '<svg class="arrow moreNextArrow" viewBox="0 0 93.7 105.1"><path d="M53.7,21L21.5,52.6l32.3,31.6v21L0,52.6L53.7,0V21z M93.7,21L61.5,52.6l32.3,31.6v21L40,52.6L93.7,0V21z"></path></svg>',
		paginationClass: 'pagination',
		nextClass: 'arrowButton',
		prevClass: 'arrowButton',
		lastClass: 'arrowButton',
		firstClass: 'arrowButton',
		pageClass: 'numButton',
		activeClass: 'currentPage',
		disabledClass: 'disabled',
	});
}



////////// 画面幅でページャーのボタンの数を変える //////////
var minButtonsLength = 3;   // 表示するボタンの数
var breakWindowSize  = 768; // ブレイクポイント

function hidePagerButton(){
	var $currentButton   = $('.pagerWrap .buttons .currentPage .num');
	var $pagerButtons    = $('.pagerWrap .buttons .num');

	var pagerButtonsLength = $pagerButtons.length;
	if (pagerButtonsLength<(minButtonsLength+1)) { return; }

	var windowSize = $(window).innerWidth();
	if (windowSize<breakWindowSize) {
		main();
		return;
	}
	if ((breakWindowSize-1)<windowSize) {
		$('.pagerWrap .buttons li').css('display', 'inline-block');
		return;
	}

	function main(){
		var currentPageNum = parseInt($currentButton.text());
		var lastButtonNum  = parseInt($pagerButtons[pagerButtonsLength-1].innerHTML);

		var prevPageNum = currentPageNum==1 ? currentPageNum+2 : currentPageNum-1;
		var nextPageNum = currentPageNum==lastButtonNum ? currentPageNum-2 : currentPageNum+1;


		for (var i=0; i<pagerButtonsLength; i++) {
			var target = $pagerButtons[i];
			var targetNum = target.innerHTML;
			if ( !(targetNum==prevPageNum || targetNum==currentPageNum || targetNum==nextPageNum) ) {
				var target02 = target.parentElement;
				target02.parentElement.style.display = 'none';
			}
		}
	}
}

var timer = 0;
$(window).on('resize', function(){
	if (timer > 0) {
		clearTimeout(timer);
	}
	timer = setTimeout(function () {
			hidePagerButton();
	}, 200);
});


});