'use strict';
(function(window,_){
// http://flaviusmatis.github.io/simplePagination.js/
	var template = _.template($('#pagination-tpl').html(),{variable: 'data'})
	var dom = template({total:230,perpage:10,pages:7});
	$('.pagination-box').html(dom)
	$(function() {
		$('#pagination-bar').pagination({
			items: 50,
			itemsOnPage:2,
			cssStyle: 'light-theme',
			prevText:'«',
			nextText:'»'
		});
	});

	// $('.pagination').on('tap','li',function(e){
	// 	if( ($(e.target).hasClass('morepage')) || ($(e.target).hasClass('noactive') )){
	// 		return;
	// 	}
	// 	$('.pagination li').removeClass('active');
	// 	$(e.target).addClass('active');
	// });

	// function activeLi(dom){
	// 	$(dom).addClass('active');
	// }
})(window,_);