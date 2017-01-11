'use strict';
(function(window) {
	var CONFIG = {
		itemsOnPage: 20, // 每页显示条数
		currentIndex: 1,
	};
	window.miliFormat = (function() {
		var DIGIT_PATTERN = /(^|\s)\d+(?=\.?\d*($|\s))/g;
		var MILI_PATTERN = /(?=(?!\b)(\d{3})+\.?\b)/g;
		return function(num) {
			return num && num.toString().replace(DIGIT_PATTERN, function(m) {
				return m.replace(MILI_PATTERN, ",");
			});
		};
	})();
	window.decomposition = function(a, b) { // 合并分解
		var li = [];
		var max = 0,
			min = 0;
		if (a >= b) {
			max = a;
			min = b;
		} else {
			max = b;
			min = a;
		}
		var s = parseInt(max / min); // 商
		var m = max % min; // 余
		for (var i = 0; i < min; i++) {
			li.push(s);
		}
		for (var i = 0; i < m; i++) {
			li[i]++;
		}

		var sum = 0,
			temp = [];
		temp.push({
			index: sum,
			value: li[sum]
		});
		for (var j = 1; j < li.length; j++) {
			sum += li[j - 1];
			temp.push({
				index: sum,
				value: li[j]
			});
		}
		return {
			list:li,
			map:temp
		};
	};
	var BaseView = Backbone.View.extend({
		className: 'table-wrapper',
		events: {
			'tap thead .sortable': 'sortField'
		},
		initialize: function(obj) {
			this.currentIndex = (obj.currentIndex - 1);
		},
		render: function() {
			var temp = this.model.data.slice((this.currentIndex * CONFIG.itemsOnPage), CONFIG.itemsOnPage * (this.currentIndex + 1));
			this.$el.html(this.template({
				data: temp
			}));
			return this;
		},
		sortField: function(e) {
			var el = $(e.currentTarget);
			var index = el.index();
			var field = el.data('sort');

			var hash;
			if (el.hasClass('asc')) {
				el.removeClass('asc');
				el.addClass('desc');
				var hash = 'order/desc/' + field;

			} else {
				el.removeClass('desc');
				el.addClass('asc');
				var hash = 'order/asc/' + field;
			}
			appRouter.navigate(hash, {
				trigger: true,
				replace: false
			});
		}
		
	});

	var ReportMarketDetail = BaseView.extend({ // 订单明细 -销售
		template: _.template($('#reportMarketDetail-tpl').html())
	});	
	var ReportMarketDetailConsumeView = BaseView.extend({ // 订单明细 -消耗
		template: _.template($('#reportMarketDetailConsume-tpl').html())
	});
	
	var ReportWorkDetail = BaseView.extend({ // 工单明细
		template: _.template($('#reportWorkDetail-tpl').html())
	});

	var ReportCardView = BaseView.extend({ // 产品汇总 视图
		template: _.template($('#reportCard-tpl').html())
	});

	var ReportProductView = BaseView.extend({ // 产品汇总 视图
		template: _.template($('#reportProduct-tpl').html())
	});

	var ReportTotalDebtView = BaseView.extend({ // 客户负债 视图
		template: _.template($('#reportTotalDebt-tpl').html())
	});

	var StaffView = BaseView.extend({ // 员工 视图
		template: _.template($('#reportEmp-tpl').html()) ,
		events: {
			'tap thead .sortable': 'sortField',
			'tap .emp-detailBtn':'showEmpDetailBtn'
		},
		showEmpDetailBtn:function(e){
			var role = $(e.currentTarget).data().role;
			var empId = $(e.currentTarget).data().id;
			var hash = 'empId=' + empId + '&tpl=';
			if(role === 'sale'){
				hash += 'reportEmpSaleDetail';
			}else if( role === 'consume'){
				hash += 'reportEmpComDetail';
			}
			window.location.href = (window.location.pathname + '?' + hash);
		}
	});

	var EmpSaleDetail = BaseView.extend({ // 员工销售业绩详情
		template: _.template($('#reportEmpSaleDetail-tpl').html()) 
	});

	var EmpComDetail = BaseView.extend({ // 员工销售业绩详情
		template: _.template($('#reportEmpComDetail-tpl').html()) 
	})
	var ReportCustomerView = BaseView.extend({ // 客户 视图
		template: _.template($('#reportCustomer-tpl').html())
	});
	var ReportStoreView = BaseView.extend({ // 营业报表
		template: _.template($('#reportStore-tpl').html())
	});
	var ReportCategoryView = BaseView.extend({ // 分类汇总报表
		template: _.template($('#reportCategory-tpl').html())
	});
	var ReportCustomerCardView = BaseView.extend({ // 卡项负债明细总览
		template: _.template($('#reportCustomerCard-tpl').html()),
		events: {
			'tap thead .sortable': 'sortField',
			'tap tbody tr': 'showDetail'
		},
		initialize: function(obj) {
			this.currentIndex = (obj.currentIndex - 1);
		},
		showDetail: function(e) {
			if (e.currentTarget.tagName.toLowerCase() == 'tr') {
				var id = $(e.currentTarget).data('id');
				var hash = 'customerId=' + id + '&tpl=reportCustomerCardDetail';
				window.location.href = (window.location.pathname + '?' + hash);
			}
		}
	});
	var ReportCustomerCardDetailView = BaseView.extend({ // 卡项负债明细总览
		template: _.template($('#reportCustomerCardDetail-tpl').html())
	});

	var ReportBrandStoresView = BaseView.extend({ // 卡项负债明细总览
		template: _.template($('#reportBrandStores-tpl').html())
	});


	


	var viewList = [{// 员工 列表
		name: 'reportEmp',
		view: StaffView
	},
	{//  员工销售业绩详情
		name: 'reportEmpSaleDetail',
		view: EmpSaleDetail
	}, 
	{//  员工消耗业绩详情
		name: 'reportEmpComDetail',
		view: EmpComDetail
	}, 
	{ // 客户报表
		name: 'reportCustomer',
		view: ReportCustomerView
	}, { // 客户总负债
		name: 'reportTotalDebt',
		view: ReportTotalDebtView
	}, {// 产品汇总 
		name: 'reportProduct',
		view: ReportProductView
	}, {// 卡项负债
		name: 'reportCard',
		view: ReportCardView
	}, {//  工单明细
		name: 'reportWorkDetail',
		view: ReportWorkDetail
	}, 
	{// 订单明细- 销售
		name: 'reportMarketDetail',
		view: ReportMarketDetail
	}, 	
	{// 订单明细 -消耗 
		name: 'reportMarketDetailConsume',
		view: ReportMarketDetailConsumeView
	}, 
	{// 门店营业报表
		name: 'reportStore',
		view: ReportStoreView
	}, {// 分类汇总
		name: 'reportCategory',
		view: ReportCategoryView
	}, {// 卡项负债明细总览
		name: 'reportCustomerCard',
		view: ReportCustomerCardView
	}, { // 卡项负债明细
		name: 'reportCustomerCardDetail',
		view: ReportCustomerCardDetailView
	}
	, { // 品牌
		name: 'reportBrandStores',
		view: ReportBrandStoresView
	}

	];

	var App = Backbone.View.extend({
		el: 'body',
		initialize: function(obj) {

			this.currentPage = 1;
			this.hasRender = false;
			this.initData(obj.data);
			this.render(this.currentPage, obj.data);
			$('.searchForm').on('submit', this.search);
			// $('.sortItem ul a').on('tap', this.search);
		},
		events: {
			'tap .sortItem .keyItems': 'selectSortItem',
			'tap .searchByTime': 'search'
		},
		selectSortItem: function(e) {
			$('.currentItem').text($(e.target).html());
		},
		render: function(pageIndex, data) {
			this.summary(data.data);
			var view = this.tableView(reportApi.tpl, pageIndex, data);
			$('.table-body').html(view.render().el);
			if(data.data.length === 0) this.noDataView();
			$("#fixTable").tableHeadFixer();
		},
		summary:function(data){// 概览
			// try{	

				

				var map = reportApi[reportApi.tpl].summary;
				var key = map.key;
				var value = map.value;
				var temp = {};
				value.map(function(el,index){
					temp[el] = 0;
				});

				if(data.length>0){
					data.map(function(el,index){
						value.map(function(a,index){
							var str = a.split('-');
							if(str.length > 1){
								var parent = str[0];
								var sub = str[1];
								el[parent].map(function(b,j){
								        if(isNaN(b[sub]-0)){
								        	     temp[a] +=  0;
								        }else{
                                                                                           	    temp[a] += (b[sub] ? (b[sub]-0) : 0);
								        }
								});
							}else{
								temp[a] += (el[a] ? (el[a]-0) : 0);
							}
						});
					});
				}
				var list = [];
				value.map(function(el,index){
					list.push({
						name:key[index],
						value:(temp[el].toFixed(2)-0).toLocaleString()
					});
				});

				var html = _.template($('#summary-tpl').html());
				var dom = html({
					list:list,
					note:reportApi[reportApi.tpl].note.text
				});
				$('.description').html(dom);

				// 检测是否显示 搜索提示

				function setPlaceholder(keys){
					if(!keys || keys.length ===0 ){return '请输入关键字'}
					var placeholder = {};
					keys.map(function(el,index){
						var str = el.substring(0,2);
						placeholder[str] = str;
					})
					return Object.keys(placeholder).join('/');
				}
				var searchConfig = reportApi[reportApi.tpl].searchConfig;
				if(searchConfig.showKeyWord){
					var txt = setPlaceholder(searchConfig.keyWord);
					$('input[type=search]').attr('placeholder',txt);	
				}
			// }catch(err){

			// }
		},
		search: function(e) {
			e.preventDefault();
			var searchKey = $('.searchKey').val();
			var sortItem = $('.currentItem').text();
			var start = $('.startTime').val();
			var end = $('.endTime').val();
			// console.log(start+' '+end + ' '+sortItem + ' '+searchKey);
			var hash = 'search/' + (searchKey.trim() ? searchKey.trim() : undefined) + '/' + sortItem + '/' + start + '/' + end;
			appRouter.navigate(hash, {
				trigger: true,
				replace: false
			});
			return false;
		},
		initData: function(data) {
			// http://flaviusmatis.github.io/simplePagination.js/
			try {
				if (!this.hasRender) {
					$('#pagination-bar').pagination({
						items: data.data.length,
						itemsOnPage: CONFIG.itemsOnPage,
						cssStyle: 'light-theme',
						prevText: '«',
						nextText: '»',
						hrefTextPrefix: '#page/'
					});
					var n = data.data.length / CONFIG.itemsOnPage;
					var i = Number.parseInt(n);
					$('.pageInfo').text('每页 ' + CONFIG.itemsOnPage + ' 条，总共 ' + ((n > i ? (i + 1) : i)) + ' 页　');
					this.hasRender = true;
				}

			} catch (err) {
				console.warn(err);
			}
		},
		tableView: function(tpl, index, data) {

			
			var ops = {
				model: data,
				currentIndex: (index ? index : 1)
			};
			var View;
			for (var i = viewList.length - 1; i >= 0; i--) {
				var el = viewList[i];
				if(tpl == el.name){
					View =  el.view;
					break;
				}
			}
			var view = new View(ops);
			return view;
		},
		noDataView:function(){
			var html = _.template($('#nodata-tpl').html());
			$('.tbody').html(html({
				len: $('thead th').length,
				width: $('.table-wrapper').width() / 2
			}));
			$('.description .sale').text('0');
		}
	});

	var Router = Backbone.Router.extend({
		initialize: function() {
			this.data = {};

			var index = reportApi.tpl.indexOf('#');
			if (index > 0) {
				reportApi.tpl = reportApi.tpl.substring(0, reportApi.tpl.indexOf('#'));
			}
			var body = this.assembling(reportApi, reportApi[reportApi.tpl]);
			var url = reportApi[reportApi.tpl].url;

			var me = this;
			this.setConfig(reportApi);
			this.loadData(url, body, function() {}, function(data) {
				me.data = data;
				app = new App({
					data: data
				});
			});
		},
		routes: {
			'page/:index': 'pageTuring',
			'': 'loadData',
			'order/desc/:field': 'descOrder',
			'order/asc/:field': 'ascOrder',
			'search/:searchKey/:searchField/:start/:end': 'search'
		},
		setConfig: function(ops) { // 配置模块
			var config = reportApi[reportApi.tpl].searchConfig;
			var isShowSearch = config.showKeyWord;
			var isShowTime = config.showTime;


			var className = (isShowSearch ? '' : 'hidden');
			var isShowTimeClass = (isShowTime  || isShowTime===undefined ? '' : 'hidden');

			$('.time-label').addClass(className);
			$('.table-nav .time-text').addClass(isShowTimeClass);
			if (config.keyWord && config.keyWord.length > 0) {
				var html = _.template($('#keywords-tpl').html());
				var dom = html({
					keyWords:config.keyWord
				});
				$('.sortItem').html(dom);
			}
			if(config.time == 'today'){
				var time = reportApi[reportApi.tpl].body.data;
				$('.startTime').val(time.start);
				$('.endTime').val(time.end);
			}
		},
		pageTuring: function(index) {
			var currentSortIndex;
			var cname;
			if ($('.desc').length != 0) {
				currentSortIndex = $('.desc').index();
				cname = 'desc';
			} else if ($('.asc').length != 0) {
				currentSortIndex = $('.asc').index();
				cname = 'asc';
			}
			var body = this.assembling(reportApi, reportApi[reportApi.tpl]);
			var url = reportApi[reportApi.tpl].url;

			app.render(index, this.data);
			$($('thead th')[currentSortIndex]).addClass(cname);
		},
		assembling: function(reportApi, reportEmp) {


			var body = reportEmp.body;
			for (var i in reportApi.base) {
				body[i] = reportApi.base[i];
			}
			return body;
		},
		loadData: function(url, body, loading, callback) {
			var data = this.assembling(reportApi, reportApi[reportApi.tpl]);
			$.ajax({
				timeout: 5000,
				data: JSON.stringify(data),
				url: url,
				beforeSend: loading,
				success: callback,
				contentType: 'application/json',
				dataType: 'json',
				type: 'post',
				error: function(jqXHR, textStatus, errorThrown) {
					if (textStatus == 'timeout') {
						console.log('timeout timeout timeout ...');
					}
				},
				complete: function() {

				},
			});
		},
		descOrder: function(field) { // 降序
			this.data.data.sort(function(a1, a2) {
				return a2[field] - a1[field];
			});
			app.render(1, this.data);
			$('#pagination-bar').pagination('drawPage', 1);
			$('.sortable[data-sort="' + field + '"]').addClass('desc');
		},
		ascOrder: function(field) { //升序
			this.data.data.sort(function(a1, a2) {
				return a1[field] - a2[field];
			});
			app.render(1, this.data);
			$('#pagination-bar').pagination('drawPage', 1);
			$('.sortable[data-sort="' + field + '"]').addClass('asc');
		},
		search: function(searchKey, searchField, start, end) {
			var body = this.assembling(reportApi, reportApi[reportApi.tpl]);
			body.data.keyWord = (searchKey === 'undefined' ? '' : searchKey);
			var config = reportApi[reportApi.tpl];
			var isShowTime = config.searchConfig.showTime;
			var isShowSearch = config.searchConfig.showKeyWord;

			
			if(isShowTime  || isShowTime === undefined){
				body.data.start = start;
				body.data.end = end;
			}else{
				delete body.data.start;
				delete body.data.end;
			}
			if(!isShowSearch){// 是否删除 关键字 参数
				delete body.data.keyWord;
			}

			var url = reportApi[reportApi.tpl].url;
			var me = this;
			this.loadData(url, body, function() {
				var html = _.template($('#loading-tpl').html());
				$('.tbody').html(html({
					len: $('thead th').length,
					width: $('.table-wrapper').width() / 2
				}));
			}, function(result) {
				if (result.retMsg && result.data.length > 0) {
					me.data = result;
					app.hasRender = false;
					app.initData(me.data);
					app.render(1, me.data);
				} else {
					app.noDataView();
				}
			});
			// body.data.keyWord = searchKey;
		}
	});

	var app;
	var appRouter = new Router();
	Backbone.history.start();

})(window);