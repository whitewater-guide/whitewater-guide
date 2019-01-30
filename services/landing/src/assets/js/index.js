$(document).ready( function() {

	/*----------------------/
	/* NAVIGATION
	/*---------------------*/

	$('#navigation').localScroll({
		duration: 1000,
		easing: 'easeInOutExpo'
	});

	$(window).on('scroll', function(){
		if( $(document).scrollTop() > 150 ) {
			$('.navbar').addClass('active');

		}else {
			$('.navbar').removeClass('active');
		}
	});

	$('#navigation li a').on('click', function() {
		if($(this).parents('.navbar-collapse.collapse').hasClass('in')) {
			$('#navigation').collapse('hide');
		}
	});


	/*----------------------/
	/* INIT FITVID
	/*---------------------*/

	$('.page-video-wrapper').fitVids();


	/*-----------------------------/
	/* FEATURE CONTENT SLIDER
	/*---------------------------*/

  $('.features-slick').slick({
    lazyLoad: 'progressive',
    dots: false,
		arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    cssEase: 'linear',
    draggable: false,
    swipe: false,
    touchMove: false,
  });


	/*----------------------/
	/* NAVIGATION SCROLLING
	/*---------------------*/

	$(window).scroll( function() {
		if( $(this).scrollTop() > 300 ) {
			$('.back-to-top').fadeIn();
		} else {
			$('.back-to-top').fadeOut();
		}
	});

	$('.back-to-top').on( 'click', function(e) {
		e.preventDefault();

		$('body, html').animate({
			scrollTop: 0
		}, 800, 'easeInOutExpo');
	});

	if($('.learn-more').length > 0) {
		$('.learn-more').localScroll({
			duration: 1000,
			easing: 'easeInOutExpo'
		});
	}

});