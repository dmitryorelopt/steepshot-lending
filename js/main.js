const $window = $(window);
const pages = [
	'current_index',
	'current_description'
];
let loading = false;
let currentPage = 0;

$window.ready(() => {
	const main = $('.main');
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
			if (currentPage > 0) {
				main.removeClass(pages[currentPage]);
				currentPage--;
				main.addClass(pages[currentPage]);
			}
		} else {
			if (currentPage < pages.length - 1) {
				main.removeClass(pages[currentPage]);
				currentPage++;
				main.addClass(pages[currentPage]);
			}
		}

		setTimeout(() => {
			loading = false;
		}, swapTime)
	});

});