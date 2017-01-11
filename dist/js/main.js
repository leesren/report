requirejs.config({
	baseUrl:'dist/lib',
	paths:{
		jquery:'../lib/zepto/zepto.min',
		backbone:'../lib/backbone/backbone-min',
		underscore:'../lib/underscore/underscore-min',
	},
	shim:{
		jquery:{
			exports:'$'
		},
		backbone:{
			deps:['underscore','jquery']
		}
	}
});
// requirejs(['../js/sale.chart'],function (a) {

// });
// requirejs(['../js/page3'],function (a) { 

// });

