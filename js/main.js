const $window = $(window);
const pages = [
	'current_index',
	'current_steepshot',
	'current_vim',
	'current_ditch',
	'current_contact'
];
const START_INDEX = 0;
let loading = false;
let currentIndex = -1;
let swapTime = 0;
let root;
let bodyWidth = 0;

$window.ready(() => {
	initVariables();
	/*Обновить переменный при изменении размеров экрана*/
	$window.resize(initVariables);

	/*Обработчик прокрутки колеса мыши*/
	$window.bind('mousewheel', (e) => {
		e.stopPropagation();
		if (loading) {
			return;
		}
		if (bodyWidth < 1200) {
			if ($('html, body').scrollTop() < 3100) {
				$('.contact').removeClass('show_message');
			}
			return;
		}
		loading = true;

		if (e.originalEvent.wheelDelta > 0) {
			swapCurrentBlock(currentIndex - 1);
		} else {
			if (!scrollDown()) {
				clearBlockAfter(300);
				return;
			}

			swapCurrentBlock(currentIndex + 1);
		}

		clearBlockAfter(swapTime);
	});
	swapCurrentBlock(START_INDEX);

	/*Обработчики кнопок*/
	$('.logo').click(() => {
		swapCurrentBlock(0);
	});

	$('.our-project-link').click(() => {
		swapCurrentBlock(1);
	});

	$('.contact-link, footer .link').click(() => {
		swapCurrentBlock(4);
	});

	$('.index .btn').click(() => {
		swapCurrentBlock(1);
	});

	$('.steepshot .btn').click(() => {
		window.open('https://play.google.com/store/apps/details?id=com.droid.steepshot&rdid=com.droid.steepshot');
	});

	$('.vim .btn').click(() => {
		window.open('https://vim.steepshot.io/');
	});

	$('.ditch .btn').click(() => {
		window.open('https://github.com/Chainers/Ditch');
	});

	$('.contact .btn').click(() => {
		$.ajax({
			type: "POST",
			url: 'https://steepshot.io/api/v1/work-request',
			data: JSON.stringify({
				name: $('.form .name input')[0].value,
				email: $('.form .email input')[0].value,
				projet_name: $('.form .project-name input')[0].value,
				description: $('.form .description-project input')[0].value
					+ ' duration: '	+ $('.form .duration input')[0].value
					+ ' urgency: ' + $('.form .start input')[0].value,
				duration: 'w',
				urgency: '1'
		}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data){
				console.log(data)
			},
			failure: function(errMsg) {
				console.log(errMsg);
			}
		});
		$('.contact').addClass('show_message');
	});

	$('.back-to-top span').click(() => {
		$('html, body').animate({
			scrollTop: 0
		}, swapTime);
	});
});

function initVariables() {
	root = $(':root');
	swapTime = parseInt(root.css('--swap-time'), 10);
	bodyWidth = getScreenWidth();
	if (bodyWidth >= 1200) {
		root.css('--container-width', '1200px');
	}
	if (bodyWidth < 1200 && bodyWidth >= 768) {
		root.css('--container-width', '768px');
	}
	if (bodyWidth < 768) {
		root.css('--container-width', '320px');
	}
}

function swapCurrentBlock(nextIndex) {
	if (nextIndex < 0 || nextIndex > pages.length - 1 || nextIndex === currentIndex) {
		return;
	}
	if (bodyWidth < 1200 && bodyWidth > 0) {
		let anchor = '.index';
		switch(nextIndex) {
			case 1:
				anchor = '.steepshot';
				break;
			case 2:
				anchor = '.vim';
				break;
			case 3:
				anchor = '.ditch';
				break;
			case 4:
				anchor = '.contact';
				break;
			default:
				break;
		}
		scrollTo(anchor);
		clearState();
		return;
	}
	const body = $('body');
	body.removeClass(pages[currentIndex]);
	body.addClass(pages[nextIndex]);
	currentIndex = nextIndex;
	clearState();
	$window.scrollTop(0);
	lockScrollOnMilliseconds(swapTime);
}

function scrollDown() {
	return $window.scrollTop() === $(document).height() - $window.height();
}

function clearBlockAfter(milliseconds) {
	setTimeout(() => {
		loading = false;
	}, milliseconds);
}

function lockScrollOnMilliseconds(milliseconds) {
	$('html').css('overflow-y', 'hidden');
	setTimeout(() => {
		$('html').css('overflow-y', 'auto');
	}, milliseconds);
}

function clearState() {
	setTimeout(() => {
		$('.contact').removeClass('show_message');
	}, swapTime);
}

function getScreenWidth() {
	return document.body.clientWidth + ($('body').hasScrollBar() * scrollbarWidth());
}

$.fn.hasScrollBar = function () {
	return this.get(0).scrollHeight > this.height() ? 1 : 0;
};

function scrollbarWidth() {
	let block = $('<div>').css({'height':'50px','width':'50px'}),
		indicator = $('<div>').css({'height':'200px'});

	$('body').append(block.append(indicator));
	let w1 = $('div', block).innerWidth();
	block.css('overflow-y', 'scroll');
	let w2 = $('div', block).innerWidth();
	$(block).remove();
	return (w1 - w2);
}

function scrollTo(anchor) {
	if (!$(anchor).offset()) return;
	$('html, body').animate({
		scrollTop: $(anchor).offset().top
	}, swapTime);
}