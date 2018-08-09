window.onload = () => {
	$(window).click((e) => {
		e.stopPropagation();
		const mainContainers = $('.main > div');
		let left = mainContainers.css('left');
		mainContainers.css('left', () => {
			return (-1 * parseFloat(left)) + 'px';
		})
	})
};