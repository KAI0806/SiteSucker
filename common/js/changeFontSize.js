$(function(){
	var windowSize;
	var fontSize;
	var target = $('html,body');
	function changeFontSize(){
		windowSize = $(window).width();
		fontSize = windowSize / 640 *62.5;
		if (windowSize<320) {
			target.css('font-size', '31.25%');
			return;
		}
		if (640<windowSize) {
			target.css('font-size', '62.5%');
			return;
		}

		target.css('font-size', fontSize + '%');
	}
	changeFontSize();

	$(window).on('resize', function(){
		changeFontSize();
	});
});