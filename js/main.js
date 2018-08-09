const $window = $(window);
const pages = [
	'current_index',
	'current_steepshot',
	'current_vim',
	'current_ditch',
	'current_contact'
];
const START_INDEX = 2;
let loading = false;
let currentIndex = 0;

$window.ready(() => {
	const swapTime = parseInt($(':root').css('--swap-time'), 10);

	$window.resize(function () {
		window.setTimeout('location.reload()', 200);
	});

	$window.bind('mousewheel', (e) => {
		e.stopPropagation();
		if (loading) {
			return;
		}
		loading = true;

		if(e.originalEvent.wheelDelta > 0) {
			swapCurrentBlock(currentIndex - 1);
		} else {
			if (!scrollDown()) {
				clearBlockAfter(300);
				return;
			}

			if (swapCurrentBlock(currentIndex + 1)) {
				$window.scrollTop(0);
				lockScrollOnMilliseconds(swapTime);
			}
		}

		clearBlockAfter(swapTime);
	});

	swapCurrentBlock(START_INDEX);

});

function swapCurrentBlock(nextIndex) {
	if (nextIndex < 0 || nextIndex > pages.length - 1 || nextIndex === currentIndex) {
		return false;
	}
	const main = $('.main');
	main.removeClass(pages[currentIndex]);
	main.addClass(pages[nextIndex]);
	currentIndex = nextIndex;
	return true;
}

function scrollDown() {
	return $window.scrollTop() === $(document).height() - $window.height()
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
	}, milliseconds)
}