'use strict';
(function (window) {
	var CONFIG = {
		itemsOnPage: 20, // 每页显示条数
		currentIndex: 1,
	};
	window.miliFormat = (function () {
		var DIGIT_PATTERN = /(^|\s)\d+(?=\.?\d*($|\s))/g;
		var MILI_PATTERN = /(?=(?!\b)(\d{3})+\.?\b)/g;

		return function (num) {
			if (!isNaN(num)) {
				return num && num.toString().replace(DIGIT_PATTERN, function (m) {
					return m.replace(MILI_PATTERN, ",");
				});
			} else {
				return num;
			}

		};
	})();
	window.decomposition = function (a, b) { // 合并分解
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
			list: li,
			map: temp
		};
	};
	window.JsCallNativeBridge = function (fnname, pram) {// 调用原生
		var ua = window.navigator.userAgent.toLowerCase();
		try {
			if (ua.indexOf('android') > 0) {
				if (NativeBridge) {
					NativeBridge[fnname](pram);
				}
			}
			if (ua.indexOf('iphone') > 0 || ua.indexOf('ipad') > 0) {
				var obj = {
					fnname: fnname,
					data: pram
				}
				window.webkit.messageHandlers.webViewApp.postMessage(obj);
			}
		} catch (error) {
			console.warn(error);
			console.warn(pram);
		}
	}
	window.device = function () {// 设备检测
		var ua = window.navigator.userAgent.toLowerCase();
		var device = { isMobile: false };
		if (ua.indexOf('ipad') > 0 || ua.indexOf('iphone') > 0 || ua.indexOf('android') > 0) {
			device.isMobile = true;
		} else {
			device.isMobile = false;
		}
		return device;
	}
	var BaseView = Backbone.View.extend({
		className: 'table-wrapper',
		events: {
			'tap thead .sortable': 'sortField'
		},
		checkIsPages: function (res) {// 检测是否分页
			if (res && res.data && Object.keys(res.data).join('').indexOf('totalSize') != -1) {
				return true;
			} else {
				return false;
			}
		},
		initialize: function (obj) {
			this.currentIndex = (obj.currentIndex - 1);
		},
		render: function () {
			var temp = [];
			if (this.checkIsPages(this.model)) {
				temp = this.model.data.data;
			} else if (this.model.data instanceof Array) {
				temp = this.model.data.slice((this.currentIndex * CONFIG.itemsOnPage), CONFIG.itemsOnPage * (this.currentIndex + 1))
			}
			this.$el.html(this.template({
				data: temp
			}));
			return this;
		},
		sortField: function (e) {
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
		template: _.template($('#reportCard-tpl').html()),
		events: {
			'tap tbody tr': 'showDetail',
			'tap thead .sortable': 'sortField',
		},
		showDetail: function (e) {
			if (e.currentTarget.tagName.toLowerCase() == 'tr') {
				var name = $(e.currentTarget).data('name');
				var hash = '&tpl=reportCardDetail&name=' + name;
				var href = window.location.href.substring(0, window.location.href.indexOf('&tpl')) + hash;
				if (!device().isMobile) {
					window.location.href = href;
				} else {
					window.JsCallNativeBridge('openReportDetailView', [{
						title: name,
						url: href
					}]); // 调用原生
					// window.location.href =   href;
				}
			}
		}
	});
	var ReportCardDetailView = BaseView.extend({ //卡项负债明细 视图
		template: _.template($('#reportCardDetail-tpl').html())
	});

	var ReportAreaRefundView = BaseView.extend({ // 退款报表汇总 视图
		template: _.template($('#reportAreaRefund-tpl').html()),
		events: {
			'tap tbody tr': 'showDetail',
			'tap thead .sortable': 'sortField',
		},
		showDetail: function (e) {
			if (e.currentTarget.tagName.toLowerCase() == 'tr') {
				var start = $('.startTime').val();
				var end = $('.endTime').val();
				var name = $(e.currentTarget).data('storename');
				var storeId = $(e.currentTarget).data('storeid');
				var hash = '&storeId=' + storeId + '&tpl=reportRefund' + "&start=" + start + "&end=" + end;
				var href = window.location.href.substring(0, window.location.href.indexOf('?')) + "?" + hash;
				if (!device().isMobile) {
					window.location.href = href;
				} else {
					window.JsCallNativeBridge('openReportDetailView', [{
						title: name,
						url: href
					}]); // 调用原生
					// window.location.href =   href;
				}
			}
		}
	});
	var ReportRefundView = BaseView.extend({ //卡项负债明细 视图
		template: _.template($('#reportRefund-tpl').html())
	});

	var ReportProductView = BaseView.extend({ // 产品汇总 视图
		template: _.template($('#reportProduct-tpl').html())
	});

	var ReportTotalDebtView = BaseView.extend({ // 客户负债 视图
		template: _.template($('#reportTotalDebt-tpl').html())
	});

	var ReportArrearDetailView = BaseView.extend({ // 欠款 视图
		template: _.template($('#reportArrearDetail-tpl').html())
	});
	var StaffView = BaseView.extend({ // 员工 视图
		template: _.template($('#reportEmp-tpl').html()),
		events: {
			'tap thead .sortable': 'sortField',
			'tap tbody tr': 'showEmpDetailBtn'
		},
		showEmpDetailBtn: function (e) {
			var start = $('.startTime').val();
			var end = $('.endTime').val();
			var empId = $(e.currentTarget).data().id;
			var name = $(e.currentTarget).data().name;
			if (!empId) {
				return;
			}
			var hash = 'storeId=' + reportApi.queryString.storeId + '&empId=' + empId + "&start=" + start + "&end=" + end + '&tpl=';
			// if(role === 'sale'){
			// 	hash += 'reportEmpSaleDetail';
			// }else if( role === 'consume'){
			// 	hash += 'reportEmpComDetail';
			// }
			var uri = window.location.href.substring(0, window.location.href.indexOf('?')) + '?';
			window.JsCallNativeBridge('openReportDetailView', [{
				title: '销售详情',
				url: uri + (hash + 'reportEmpSaleDetail')
			}, {
				title: '消耗详情',
				url: uri + (hash + 'reportEmpComDetail')
			}]); // 调用原生
			if (e.target.nodeName.toLowerCase() === 'a') {
				if ($(e.target).data().role === 'sale') {
					window.location.href = uri + (hash + 'reportEmpSaleDetail');
				} else {
					window.location.href = uri + (hash + 'reportEmpComDetail');
				}

			}
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
		template: _.template($('#reportCategory-tpl').html()),
		events: {
			'tap tbody tr': 'showDetail',
			'tap thead .sortable': 'sortField',
		},
		showDetail: function (e) {
			if (e.currentTarget.tagName.toLowerCase() == 'tr') {
				var id = $(e.currentTarget).data('id');
				if (!id) {
					return;
				}
				var start = $('.startTime').val();
				var end = $('.endTime').val();
				var name = $(e.currentTarget).data('name');
				var storeId = reportApi.queryString.storeId;
				var hash = 'storeId=' + storeId + '&tpl=reportNextCategory&id=' + id + '&start=' + start + '&end' + end;
				var href = window.location.href.substring(0, window.location.href.indexOf('?')) + '?' + hash;
				if (!device().isMobile) {
					window.location.href = href;
				} else {
					window.JsCallNativeBridge('openReportDetailView', [{
						title: name,
						url: href
					}]); // 调用原生
					// window.location.href =   href;
				}
			}
		}
	});
	var ReportNextCategoryView = ReportCategoryView.extend({ // 分类汇总层级报表
		template: _.template($('#reportCategory-tpl').html())
	});
	var ReportCustomerCardView = BaseView.extend({ // 卡项负债明细总览
		template: _.template($('#reportCustomerCard-tpl').html()),
		events: {
			'tap thead .sortable': 'sortField',
			'tap tbody tr': 'showDetail'
		},
		initialize: function (obj) {
			this.currentIndex = (obj.currentIndex - 1);
		},
		showDetail: function (e) {
			if (e.currentTarget.tagName.toLowerCase() == 'tr') {
				var id = $(e.currentTarget).data('id');
				if (!id) {
					return;
				}
				var start = $('.startTime').val();
				var end = $('.endTime').val();
				var name = $(e.currentTarget).data('name');
				var hash = 'customerId=' + id + '&tpl=reportCustomerCardDetail' + '&start=' + start + '&end=' + end;

				window.JsCallNativeBridge('openReportDetailView', [{
					title: name + '-卡项负债详情',
					url: window.location.href.substring(0, window.location.href.indexOf('?')) + '?' + hash
				}]); // 调用原生
				if (!device().isMobile) {
					window.location.href = (window.location.pathname + '?' + hash);
				}
			}
		}
	});
	var ReportCustomerCardDetailView = BaseView.extend({ // 卡项负债明细总览
		template: _.template($('#reportCustomerCardDetail-tpl').html())
	});
	var ReportBrandView = BaseView.extend({ // 品牌营业报表
		template: _.template($('#reportBrand-tpl').html())
	});
	var ReportBrandCategoryView = BaseView.extend({ // 品牌分类汇总报表
		template: _.template($('#reportBrandCategory-tpl').html())
	});

	var ReportBrandProductView = BaseView.extend({ // 品牌产品汇总 视图
		template: _.template($('#reportBrandProduct-tpl').html())
	});
	var ReportBrandCardView = BaseView.extend({ // 品牌卡项汇总 视图
		template: _.template($('#reportBrandCard-tpl').html())
	});

	var AreaReportEvaluteView = BaseView.extend({ // 区域星级平分视图
		template: _.template($('#areaReportEvalute-tpl').html()),
		events: {
			'tap tbody tr': 'showDetail',
			'tap thead .sortable': 'sortField',
		},
		showDetail: function (e) {
			if (e.currentTarget.tagName.toLowerCase() == 'tr') {
				var id = $(e.currentTarget).data('id');
				var value = $(e.currentTarget).data('value');
				if (!id) {
					return;
				}
				var start = $('.startTime').val();
				var end = $('.endTime').val();
				var name = $(e.currentTarget).data('name');
				var lv = $(e.currentTarget).data('lv');
				var hash = 'organizationId=' + id + '&tpl=areaReportEvalute&eValue=' + value + "&start=" + start + "&end=" + end;
				if (lv == 0) {
					hash = 'cempId=' + id + '&tpl=reportWorkDetail&eValue=' + value + "&start=" + start + "&end=" + end;
				}
				var href = window.location.href.substring(0, window.location.href.indexOf('?')) + '?' + hash;
				if (!device().isMobile) {
					window.location.href = href;
				} else {
					window.JsCallNativeBridge('openReportDetailView', [{
						title: (lv == 0) ? (name + '门店消耗') : (name + '-区域管理'),
						url: href
					}]); // 调用原生
					// window.location.href =   href;
				}
			}
		}
	});

	var AreaReportBusinessView = BaseView.extend({ // 区域营业报表视图
		template: _.template($('#areaReportBusiness-tpl').html()),
		events: {
			'tap tbody tr': 'showDetail',
			'tap thead .sortable': 'sortField',
		},
		showDetail: function (e) {
			if (e.currentTarget.tagName.toLowerCase() == 'tr') {
				var id = $(e.currentTarget).data('id');
				if (!id) {
					return;
				}
				var start = $('.startTime').val();
				var end = $('.endTime').val();
				var name = $(e.currentTarget).data('name');
				var lv = $(e.currentTarget).data('lv');
				var hash = 'organizationId=' + id + '&tpl=areaReportBusiness&isFirst=0' + '&start=' + start + '&end=' + end;
				if (lv == 0) {
					hash = 'storeId=' + id + '&tpl=reportStore' + '&start=' + start + '&end=' + end;
				}
				var href = window.location.href.substring(0, window.location.href.indexOf('?')) + '?' + hash;
				if (!device().isMobile) {
					window.location.href = href;
				} else {
					window.JsCallNativeBridge('openReportDetailView', [{
						title: name,
						url: href
					}]); // 调用原生
					// window.location.href =   href;
				}
			}
		}
	});

	var ReportRcommissionView = BaseView.extend({ // 品牌卡项汇总 视图
		template: _.template($('#reportRcommission-tpl').html())
	});
	var ReportCustomerArriveView = BaseView.extend({ // 到店排行
		template: _.template($('#reportCustomerArrive-tpl').html())
	});

	// 体验券
	var ReportBrandCouponsView = BaseView.extend({ // 品牌体验券
		//template: _.template($('#reportBrandCoupons-tpl').html()),
		template: _.template($('#reportBrandCoupons-tpl').html()),
		events: {
			'tap tbody tr': 'showDetail',
			'tap thead .sortable': 'sortField',
		},
		showDetail: function (e) {
			if (e.currentTarget.tagName.toLowerCase() == 'tr') {
				var id = $(e.currentTarget).data('id');
				var couponId = $(e.currentTarget).data('couponid');
				if (!id) {
					return;
				}
				var start = $('.startTime').val();
				var end = $('.endTime').val();
				var name = $(e.currentTarget).data('name');
				// var hash = 'storeId=' + id + '&tpl=reportStoreCoupons' + "&start=" + start + "&end=" + end;
				// var href = window.location.href.substring(0, window.location.href.indexOf('?')) + '?' + hash;
				var hash = 'storeId=' + id + '&tpl=reportStoreCouponsDetail&couponId=' + couponId + "&start=" + start + "&end=" + end;
				var href = window.location.href.substring(0, window.location.href.indexOf('?')) + "?" + hash;
				if (!device().isMobile) {
					window.location.href = href;
				} else {
					window.JsCallNativeBridge('openReportDetailView', [{
						title: name,
						url: href
					}]); // 调用原生
					// window.location.href =   href;
				}
			}
		}
	});
	var ReportStoreCouponsView = BaseView.extend({ // 门店体验券
		template: _.template($('#reportStoreCoupons-tpl').html()),
		events: {
			'tap tbody tr': 'showDetail',
			'tap thead .sortable': 'sortField',
		},
		showDetail: function (e) {
			if (e.currentTarget.tagName.toLowerCase() == 'tr') {
				var id = $(e.currentTarget).data('id');
				if (!id) {
					return;
				}
				var start = $('.startTime').val();
				var end = $('.endTime').val();
				var name = $(e.currentTarget).data('name');
				var hash = '&tpl=reportStoreCouponsDetail&couponId=' + id + "&start=" + start + "&end=" + end;
				var href = window.location.href.substring(0, window.location.href.indexOf('&tpl')) + hash;
				if (!device().isMobile) {
					window.location.href = href;
				} else {
					window.JsCallNativeBridge('openReportDetailView', [{
						title: name,
						url: href
					}]); // 调用原生
					// window.location.href =   href;
				}
			}
		}
	});
	var ReportStoreCouponsDetailView = BaseView.extend({ // 门店体验券详情
		template: _.template($('#reportStoreCouponsDetail-tpl').html())
	});


	//  区域品类汇总报表
	var AreaReportCategoryView = BaseView.extend({ // 品牌卡项汇总 视图
		template: _.template($('#areaReportCategory-tpl').html()),
		events: {
			'tap tbody tr': 'showDetail',
			'tap thead .sortable': 'sortField',
		},
		showDetail: function (e) {
			if (e.currentTarget.tagName.toLowerCase() == 'tr') {
				var id = $(e.currentTarget).data('id');
				var orgid = $(e.currentTarget).data('orgid');
				if (!id) {
					return;
				}
				var start = $('.startTime').val();
				var end = $('.endTime').val();
				var name = $(e.currentTarget).data('name');
				var lv = $(e.currentTarget).data('lv');
				var hash = 'organizationId=' + orgid + '&tpl=areaReportCategory&isFirst=0&id=' + id + "&start=" + start + "&end=" + end;
				if (lv == 0) {
					hash = 'storeId=' + id + '&tpl=reportCategory' + "&start=" + start + "&end=" + end;
				}
				var href = window.location.href.substring(0, window.location.href.indexOf('?')) + '?' + hash;
				if (!device().isMobile) {
					window.location.href = href;
				} else {
					window.JsCallNativeBridge('openReportDetailView', [{
						title: name,
						url: href
					}]); // 调用原生
					// window.location.href =   href;
				}
			}
		}

	});

	var AreaReportCardView = BaseView.extend({ // 区域卡项负债视图
		template: _.template($('#areaReportCard-tpl').html()),
		events: {
			'tap tbody tr': 'showDetail',
			'tap thead .sortable': 'sortField',
		},
		showDetail: function (e) {
			if (e.currentTarget.tagName.toLowerCase() == 'tr') {
				var id = $(e.currentTarget).data('id');
				if (!id) {
					return;
				}
				var start = $('.startTime').val();
				var end = $('.endTime').val();
				var name = $(e.currentTarget).data('name');
				var lv = $(e.currentTarget).data('lv');
				var hash = 'organizationId=' + id + '&tpl=areaReportCard&isFirst=0&name=' + decodeURIComponent(name) + "&start=" + start + "&end=" + end;
				if (lv == 0) {
					//hash = 'storeId=' + id + '&tpl=reportCard';
					hash = 'storeId=' + id + '&tpl=reportCardDetail&name=' + name + "&start=" + start + "&end=" + end;
				}
				var href = window.location.href.substring(0, window.location.href.indexOf('?')) + '?' + hash;
				if (!device().isMobile) {
					window.location.href = href;
				} else {
					window.JsCallNativeBridge('openReportDetailView', [{
						title: name,
						url: href
					}]); // 调用原生
					// window.location.href =   href;
				}
			}
		}
	});
	var AreaReportProductView = BaseView.extend({ // 区域产品汇总视图
		template: _.template($('#areaReportProduct-tpl').html()),
		events: {
			'tap tbody tr': 'showDetail',
			'tap thead .sortable': 'sortField',
		},
		showDetail: function (e) {
			if (e.currentTarget.tagName.toLowerCase() == 'tr') {
				var id = $(e.currentTarget).data('id');
				var orgid = $(e.currentTarget).data('orgid');
				if (!id) {
					return;
				}
				var start = $('.startTime').val();
				var end = $('.endTime').val();
				var name = $(e.currentTarget).data('name');
				var lv = $(e.currentTarget).data('lv');
				var hash = 'organizationId=' + orgid + '&tpl=areaReportProduct&isFirst=0&id=' + id + "&start=" + start + "&end=" + end;
				var href = window.location.href.substring(0, window.location.href.indexOf('?')) + '?' + hash;
				if (!device().isMobile) {
					window.location.href = href;
				} else {
					window.JsCallNativeBridge('openReportDetailView', [{
						title: name,
						url: href
					}]); // 调用原生
					// window.location.href =   href;
				}
			}
		}
	});
	var ReportCustomerSourceView = BaseView.extend({ // 客户来源统计视图
		template: _.template($('#reportCustomerSource-tpl').html()),
		events: {
			'tap tbody tr': 'showDetail',
			'tap thead .sortable': 'sortField',
		},
		showDetail: function (e) {
			if (e.currentTarget.tagName.toLowerCase() == 'tr') {
				var id = $(e.currentTarget).data('id');
				if (!id) {
					return;
				}
				var start = $('.startTime').val();
				var end = $('.endTime').val();
				var name = $(e.currentTarget).data('name');
				var hash = 'storeId=' + reportApi.queryString.storeId + '&tpl=reportCustomer&id=' + id + '&start=' + start + '&end' + end;
				var href = window.location.href.substring(0, window.location.href.indexOf('?')) + '?' + hash;
				if (!device().isMobile) {
					window.location.href = href;
				} else {
					window.JsCallNativeBridge('openReportDetailView', [{
						title: name,
						url: href
					}]); // 调用原生
					// window.location.href =   href;
				}
			}
		}
	});
	var reportTakeGoodsView = BaseView.extend({ // 产品取货视图
		template: _.template($('#reportTakeGoods-tpl').html()),
		events: {
			'tap tbody tr': 'showDetail',
			'tap thead .sortable': 'sortField',
		},
		showDetail: function (e) {
			if (e.currentTarget.tagName.toLowerCase() == 'tr') {
				var id = $(e.currentTarget).data('id');
				if (!id) {
					return;
				}
				var start = $('.startTime').val();
				var end = $('.endTime').val();
				var name = $(e.currentTarget).data('name') + "（" + $(e.currentTarget).data('store') + "）";
				var hash = '?organizationId=' + $(e.currentTarget).data('organizationid') + '&tpl=reportTakeGoodsDetail&productId=' + id + "&start=" + start + "&end=" + end;
				var href = window.location.href.substring(0, window.location.href.indexOf('?')) + hash;
				if (!device().isMobile) {
					window.location.href = href;
				} else {
					window.JsCallNativeBridge('openReportDetailView', [{
						title: name,
						url: href
					}]); // 调用原生
					// window.location.href =   href;
				}
			}
		}
	});
	var reportTakeGoodsDetailView = BaseView.extend({ // 产品取货详情视图
		template: _.template($('#reportTakeGoodsDetail-tpl').html()),
	});
	var customerTransOrdersReportView = BaseView.extend({ // 客户临时转店消费记录
		template: _.template($('#customerTransOrdersReport-tpl').html()),
		events: {
			'tap tbody tr': 'showDetailBtn',
			'tap thead .sortable': 'sortField',
		},
		showDetailBtn: function (e) {
			var start, end;
			var customerId = $(e.currentTarget).data("id");
			var storeId = $(e.currentTarget).data("storeid");
			var time = $(e.currentTarget).data('time');
			start = end = time.substring(0, time.indexOf(" "));
			if (!customerId) {
				return;
			}
			var hash = 'storeId=' + storeId + '&customerId=' + customerId + "&start=" + start + "&end=" + end + '&tpl=';
			var uri = window.location.href.substring(0, window.location.href.indexOf('?')) + '?';
			window.JsCallNativeBridge('openReportDetailView', [{
				title: '销售详情',
				url: uri + (hash + 'reportMarketDetail')
			}, {
				title: '消耗详情',
				url: uri + (hash + 'reportWorkDetail')
			}]); // 调用原生
			if (e.target.nodeName.toLowerCase() === 'a') {
				if ($(e.target).data().role === 'sale') {
					window.location.href = uri + (hash + 'reportMarketDetail');
				} else {
					window.location.href = uri + (hash + 'reportWorkDetail');
				}

			}
		}
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
	}, { // 卡项负债明细
		name: 'reportCardDetail',
		view: ReportCardDetailView
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
	},
	{// 分类汇总层级
		name: 'reportNextCategory',
		view: ReportNextCategoryView
	},
	{// 卡项负债明细总览
		name: 'reportCustomerCard',
		view: ReportCustomerCardView
	}, { // 卡项负债明细
		name: 'reportCustomerCardDetail',
		view: ReportCustomerCardDetailView
	}, { // 退款报表汇总
		name: 'reportAreaRefund',
		view: ReportAreaRefundView
	}, { // 退款报表
		name: 'reportRefund',
		view: ReportRefundView
	}, { // 品牌营业报表
		name: 'reportBrand',
		view: ReportBrandView
	}, {// 品牌分类汇总
		name: 'reportBrandCategory',
		view: ReportBrandCategoryView
	}, {// 品牌产品汇总
		name: 'reportBrandProduct',
		view: ReportBrandProductView
	}, {// 品牌卡项负债
		name: 'reportBrandCard',
		view: ReportBrandCardView
	}, {// 品牌卡项负债
		name: 'reportArrearDetail',
		view: ReportArrearDetailView
	}, {// 区域星级评分视图
		name: 'areaReportEvalute',
		view: AreaReportEvaluteView
	}, {// 区域管理视图
		name: 'reportRcommission',
		view: ReportRcommissionView
	}, {// 区域营业报表视图
		name: 'areaReportBusiness',
		view: AreaReportBusinessView
	}, {// 区域品类汇总视图
		name: 'areaReportCategory',
		view: AreaReportCategoryView
	}, {// 区域卡项负债视图
		name: 'areaReportCard',
		view: AreaReportCardView
	}, {// 区域产品汇总视图
		name: 'areaReportProduct',
		view: AreaReportProductView
	}, {// 到店排行视图
		name: 'reportCustomerArrive',
		view: ReportCustomerArriveView
	}, {// 到店排行视图
		name: 'reportCustomerSource',
		view: ReportCustomerSourceView
	}, {// 取货报表视图
		name: 'reportTakeGoods',
		view: reportTakeGoodsView
	}, {// 取货报表详情视图
		name: 'reportTakeGoodsDetail',
		view: reportTakeGoodsDetailView
	}, {// 品牌体验券视图
		name: 'reportBrandCoupons',
		view: ReportBrandCouponsView
	}, {// 门店体验券视图
		name: 'reportStoreCoupons',
		view: ReportStoreCouponsView
	}, {// 门店体验券详情视图
		name: 'reportStoreCouponsDetail',
		view: ReportStoreCouponsDetailView
	}, {// 客户临时转店消费记录视图
		name: 'customerTransOrdersReport',
		view: customerTransOrdersReportView
	}

	];

	var App = Backbone.View.extend({
		el: 'body',
		initialize: function (obj) {

			this.currentPage = 1;
			this.hasRender = false;
			this.initData(obj.data);
			this.render(this.currentPage, obj.data);
			$('.searchForm').on('submit', this.search);
			// $('.sortItem ul a').on('tap', this.search);
		},
		events: {
			'tap .sortItem .keyItems': 'selectSortItem',
			'tap .searchByTime': 'search',
			'tap .searchCheckbox': 'searchCheckbox'
		},
		selectSortItem: function (e) {
			$('.currentItem').text($(e.target).html());
		},
		searchCheckbox: function () { // checkbox
			var checkbox = !$(".searchCheckbox input").is(':checked');
			var data = reportApi[reportApi.tpl].body.data;
			var showCheckbox = reportApi[reportApi.tpl].searchConfig.showCheckbox
			var checkboxParam = showCheckbox.param;
			if (checkbox) {
				data[checkboxParam] = showCheckbox.checkedVal;
			} else {
				data[checkboxParam] = showCheckbox.checkVal;
			}

		},
		render: function (pageIndex, data) {
			this.summary(data.data);
			var view = this.tableView(reportApi.tpl, pageIndex, data);
			$('.table-body').html(view.render().el);
			if (data.data.length === 0) this.noDataView();
			if (data.data.data && data.data.data.length === 0) { this.noDataView(); }
			$("#fixTable").tableHeadFixer();
			this.fixedTableColoum();//固定首列
		},
		fixedTableColoum: function () {//固定首列
			var list = [];
			$('.first-coloum-flag').map(function (index, el) {
				list.push({
					name: ($(el).text() + '').trim(),
					height: ($(el)[0].clientHeight) + 'px',
					color: $(el).parent().css('color')
					// height:($(el)[0].height())+'px'
				});
			});
			if (list.length != 0) {
				try {
					var template = _.template($('#fixed-coloum-tpl').html(), { variable: 'data' });
					var html = template({ list: list });
					$(html).insertBefore("#fixTable");
					$('.first-coloum-wrap').css("width", $('.fixed-coloum-header')[0].clientWidth + 'px');
					$('.t-header').text($('.table .fixed-coloum-header').text());
					var height = $('.table .fixed-coloum-header')[0].offsetHeight;
					$('.t-header').css({ height: height + 'px', 'line-height': height + 'px' });

					$(document).ready(function () {
						$($('.table-wrapper div')[0]).scroll(function (evt) {
							var scrollTop = $($('.table-wrapper div')[0]).scrollTop();
							if (scrollTop === 0) {
								$('.layout-col2-v .t-header').css('border-bottom', '1px solid #eee');
								$('.t-body-tr').css('transform', 'translate3d(0,' + (0) + 'px,0)');
							} else {
								$('.t-body-tr').css('transform', 'translate3d(0,' + (-scrollTop) + 'px,0)');
								$('.layout-col2-v .t-header').css('border-bottom', '1px solid transparent')
							}
							$('.t-body-tr')[0].offsetHeight;
						});
					});
				} catch (error) {
					console.error(error);
				}

			}

		},
		checkIsPages: function (res) {// 检测是否分页
			if (res && res.data) {
				if (res.hasOwnProperty('totalSize') && res.hasOwnProperty('pageNum')) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}

		},
		summary: function (data) {// 概览
			// try{

			if (!data) { return; }

			var map = reportApi[reportApi.tpl].summary;
			var key = map.key;
			var value = this.checkIsPages(data) ? map.serverValue : map.value;
			var temp = {};
			value.map(function (el, index) {
				temp[el] = 0;
			});

			if (data.length > 0) {
				data.map(function (el, index) {
					value.map(function (a, index) {
						var str = a.split('-');
						if (str.length > 1) {
							var parent = str[0];
							var sub = str[1];
							el[parent].map(function (b, j) {
								if (isNaN(b[sub] - 0)) {
									temp[a] += 0;
								} else {
									temp[a] += (b[sub] ? (b[sub] - 0) : 0);
								}
							});
						} else {
							if (reportApi.queryString.tpl == 'reportCustomerCardDetail' && (el[a] - 0) >= 9999 && a === 'totalRestTimes') {// 说明是对于无线次数卡的总次数
								temp[a] += 0;
							} else if (a == "length") {
								temp[a] = data.length;
							} else {
								temp[a] += (el[a] ? (el[a] - 0) : 0);
							}
						}
					});
				});
			}
			if (this.checkIsPages(data)) {
				var sum = data.sumMap;
				value.map(function (el, index) {
					temp[el] = sum[el] - 0;
				});
			}
			var list = [];
			var cacheReportData = window.cacheReportData;
			value.map(function (el, index) {
				// 营业报表处理 销售 和消耗目标 
				if ((reportApi.tpl === 'reportStore' || reportApi.tpl === 'areaReportBusiness') && cacheReportData.reportStore) {
					var t = 0;
					if (el === 'saleTarget' || el === 'consumeTarget' || el === 'arriveSum') {
						t = cacheReportData.reportStore[el];
					} else {
						t = temp[el];
					}
					list.push({
						name: key[index],
						value: isNaN(t) ? t : (t - 0)
					});
				} else if (reportApi.tpl === 'reportRefund' && cacheReportData.reportRefund) {  // 退款报表处理
					var t = 0;
					if (el === 'cashPaySum' || el === 'balancePaySum' || el === 'productPaySum') {
						t = cacheReportData.reportRefund[el];
					} else {
						t = temp[el];
					}
					list.push({
						name: key[index],
						value: isNaN(t) ? t : (t - 0)
					});
				} else {
					list.push({
						name: key[index],
						value: temp[el]
					});
				}
			});

			var html = _.template($('#summary-tpl').html());

			var dom = html({
				list: list,
				note: reportApi[reportApi.tpl].note.text
			});
			$('.description').html(dom);

			// 检测是否显示 搜索提示

			function setPlaceholder(keys) {
				if (!keys || keys.length === 0) { return '请输入关键字' }
				var placeholder = {};
				keys.map(function (el, index) {
					var str = el.substring(0, 4);
					placeholder[str] = str;
				})
				return Object.keys(placeholder).join('/');
			}
			var searchConfig = reportApi[reportApi.tpl].searchConfig;
			if (searchConfig.showKeyWord) {
				var txt = setPlaceholder(searchConfig.keyWord);
				$('input[type=search]').attr('placeholder', txt);
			}
			// }catch(err){

			// }
		},
		limitTime: function (start, end) {// 检测是否超过 3个月
			var threeMonth = 3 * 30 * 24 * 60 * 60 * 1000;

			if (start && end) {
				var slice = start.split('-');
				var date1 = new Date();
				date1.setFullYear(slice[0]);
				date1.setMonth(slice[1] - 1);
				date1.setDate(slice[2]);

				var date2 = new Date();
				var slice2 = end.split('-');
				date2.setFullYear(slice2[0]);
				date2.setMonth(slice2[1] - 1);
				date2.setDate(slice2[2]);

				return (date2 - date1) > threeMonth;

			}
			return false;

		},
		search: function (e) {
			e.preventDefault();
			var searchKey = $('.searchKey').val();
			var sortItem = $('.currentItem').text();
			var start = $('.startTime').val();
			var end = $('.endTime').val();
			var searchCheckbox = !$(".searchCheckbox input").is(':checked');
			// 时间限制
			// if(this.limitTime(start,end)){ 
			// 	return ;
			// }
			//console.log(start+' '+end + ' '+sortItem + ' '+searchKey);
			var hash = 'search/' + (searchKey.trim() ? searchKey.trim() : undefined) + '/' + sortItem + '/' + start + '/' + end + '/' + searchCheckbox;
			appRouter.navigate(hash, {
				trigger: true,
				replace: false
			});
			return false;
		},
		initData: function (res) {
			// http://flaviusmatis.github.io/simplePagination.js/
			try {
				if (!this.hasRender) {
					var totalItems = res.data;
					var totalItemSize = totalItems.length;
					if (res && Object.keys(totalItems).join('').indexOf('totalSize') != -1) // 判断是不是使用分页形式
					{
						totalItemSize = totalItems.totalSize - 0;
					}

					$('#pagination-bar').pagination({
						items: totalItemSize,
						itemsOnPage: CONFIG.itemsOnPage,
						cssStyle: 'light-theme',
						prevText: '«',
						nextText: '»',
						hrefTextPrefix: '#page/'
					});
					var n = totalItemSize / CONFIG.itemsOnPage;
					var i = isNaN(Number.parseInt(n)) ? 0 : Number.parseInt(n);
					$('.pageInfo').text('每页 ' + CONFIG.itemsOnPage + ' 条，总共 ' + ((n > i ? (i + 1) : i)) + ' 页　');
					this.hasRender = true;
				}

			} catch (err) {
				console.warn(err);
			}
		},
		tableView: function (tpl, index, data) {


			var ops = {
				model: data,
				currentIndex: (index ? index : 1)
			};
			var View;
			for (var i = viewList.length - 1; i >= 0; i--) {
				var el = viewList[i];
				if (tpl == el.name) {
					View = el.view;
					break;
				}
			}
			var view = new View(ops);
			return view;
		},
		noDataView: function () {
			var html = _.template($('#nodata-tpl').html());
			$('.tbody').html(html({
				len: $('thead th').length,
				width: $('.table-wrapper').width() / 2
			}));

			if (reportApi.tpl != 'reportStore') {
				$('.description .sale').text('0');
			}
		}
	});

	var Router = Backbone.Router.extend({
		initialize: function () {
			this.data = {};

			var index = reportApi.tpl.indexOf('#');
			if (index > 0) {
				reportApi.tpl = reportApi.tpl.substring(0, reportApi.tpl.indexOf('#'));
			}
			var body = this.assembling(reportApi, reportApi[reportApi.tpl]);
			var url = reportApi[reportApi.tpl].url;

			var me = this;
			this.setConfig(reportApi);
			this.loadData(url, body, function () { }, function (data) {
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
			'search/:searchKey/:searchField/:searchCheckbox/:start/:end': 'search'
		},
		setConfig: function (ops) { // 配置模块
			var config = reportApi[reportApi.tpl].searchConfig;
			var isShowSearch = config.showKeyWord;
			var isShowTime = config.showTime;
			var isShowCheckbox = config.showCheckbox;

			var className = (isShowSearch ? '' : 'hidden');
			var isShowTimeClass = (isShowTime || isShowTime === undefined ? '' : 'hidden');
			//var isShowCheckboxClass = (isShowCheckbox ? '' : 'none');

			$('.time-label').addClass(className);
			if (isShowTimeClass === 'hidden') {
				$('.table-nav .time-text').remove();
			}
			$('.table-nav .time-text').addClass(isShowTimeClass);
			if (config.keyWord && config.keyWord.length > 0) {
				var html = _.template($('#keywords-tpl').html());
				var dom = html({
					keyWords: config.keyWord
				});
				$('.sortItem').html(dom);
			}

			//var configCheckbox = config.showCheckbox;
			if (isShowCheckbox && isShowCheckbox.text.length > 0) {
				$('.searchCheckbox').removeClass("none");
				$('.searchCheckbox span').text(isShowCheckbox.text);
				$(".searchCheckbox input").prop('checked', isShowCheckbox.checked);
			}

			if (config.time == 'today') {
				var time = reportApi[reportApi.tpl].body.data;
				$('.startTime').val(time.start);
				$('.endTime').val(time.end);
			}

		},
		pageTuring: function (index) {
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
			if (body.data.hasOwnProperty('page') && body.data.hasOwnProperty('size')) {
				body.data.page = index;
				var me = this;
				this.loadData(url, body, function () { }, function (res) {
					if (res && res.data) {
						me.data = res;
						app.render(index, me.data);
					}
				});
			} else {
				app.render(index, this.data);
			}

			$($('thead th')[currentSortIndex]).addClass(cname);
		},
		assembling: function (reportApi, reportEmp) {
			var body = reportEmp.body;
			for (var i in reportApi.base) {
				body[i] = reportApi.base[i];
			}
			return body;
		},
		loadData: function (url, body, loading, callback) {
			var data = this.assembling(reportApi, reportApi[reportApi.tpl]);
			var me = this;
			window.cacheReportData.reportStore = undefined;
			window.cacheReportData.reportRefund = undefined;
			function handleReportBusiness(result) {// 处理营业报表数据
				if (result.data.data || result.data.dataList) {
					// 处理退款报表数据
					if (reportApi.tpl === 'reportRefund') {
						var cashPaySum = result.data.cashPaySum;  // 现金汇总
						var balancePaySum = result.data.balancePaySum;  // 会员卡汇总
						var productPaySum = result.data.productPaySum;   // 金额卡汇总
						window.cacheReportData.reportRefund = {
							cashPaySum: cashPaySum,
							balancePaySum: balancePaySum,
							productPaySum: productPaySum
						}
						result.data = result.data.dataList;
					} else {
						var consumeTarget = result.data.consumeTarget;//目标消耗业绩
						var saleTarget = result.data.saleTarget;//目标销售业绩
						var arriveSum = result.data.arriveSum;//到访人数统计
						window.cacheReportData.reportStore = {
							consumeTarget: consumeTarget,
							saleTarget: saleTarget,
							arriveSum: arriveSum
						}
						window.localStorage.setItem("businessHeader",JSON.stringify(result.data.paymentModelList));
						result.data = result.data.data;
					}
				} else {
					result.data = [];
				}
				return result;
			}
			$.ajax({
				timeout: 30000,
				data: JSON.stringify(data),
				url: url,
				beforeSend: loading,
				success: function (data) {
					var _data = data;
					if (reportApi.tpl === 'areaReportBusiness' || reportApi.tpl === 'reportStore' || reportApi.tpl === 'reportRefund') {// 处理营业报表 退款报表
						_data = handleReportBusiness(data);
					}
					callback(_data);
				},
				contentType: 'application/json',
				dataType: 'json',
				type: 'POST',
				error: function (jqXHR, textStatus, errorThrown) {
					if (textStatus == 'timeout') {
						console.error('timeout timeout timeout ...');
					}
				},
				complete: function () {

				},
			});
		},
		descOrder: function (field) { // 降序
			this.data.data.sort(function (a1, a2) {
				return a2[field] - a1[field];
			});
			app.render(1, this.data);
			$('#pagination-bar').pagination('drawPage', 1);
			$('.sortable[data-sort="' + field + '"]').addClass('desc');
		},
		ascOrder: function (field) { //升序
			this.data.data.sort(function (a1, a2) {
				return a1[field] - a2[field];
			});
			app.render(1, this.data);
			$('#pagination-bar').pagination('drawPage', 1);
			$('.sortable[data-sort="' + field + '"]').addClass('asc');
		},
		handleProjectType: function (value) {// 处理员工销售的项目类型搜索
			try {
				var aa = value.trim();
				var list = aa.split(' ');
				var han = [];
				list.map(function (el, index) {
					if (el) {
						han.push(el);
					}
				});
				list = han;
				var keyWord = '', type = '';
				var typeCodeName = {
					'套盒': 'productBox',
					'次数卡': 'frequencyCard',
					'金额卡': 'amountCard',
					'合作项目': 'cooperativeProject',
					'套餐': 'projectPackage',
					'服务项目': 'serviceProject',
					'仪器': 'instrument',
					'家居产品': 'cosmetics',
					'会员充值': 'memberCard'
				};
				if (list.length === 1) {
					var tempK = list[0].trim();
					if (typeCodeName[tempK]) {
						keyWord = '';
						type = typeCodeName[tempK];
					} else {
						keyWord = list[0];
						type = '';
					}

				} else {
					keyWord = list.slice(0, list.length - 1).join('');
					var searchType = list[list.length - 1] ? list[list.length - 1].trim() : '';
					// 类型名称
					if (typeCodeName[searchType]) {
						type = typeCodeName[searchType];
					} else {
						keyWord = aa;
						type = '';
					}

				}
			} catch (err) {
				console.error('搜索处理=>' + err);
			}
			return {
				keyWord: keyWord,
				type: type
			}
		},
		search: function (searchKey, searchField, start, end) {
			$('.searchKey').blur();
			var body = this.assembling(reportApi, reportApi[reportApi.tpl]);
			body.data.keyWord = (searchKey === 'undefined' ? '' : searchKey);
			if (reportApi.tpl === 'reportEmpSaleDetail') {
				if (body.data.keyWord) {
					var res = this.handleProjectType(searchKey);
					body.data.keyWord = res.keyWord;
					body.data.type = res.type;
				} else {
					body.data.keyWord = '';
					body.data.type = '';
				}

			}
			var config = reportApi[reportApi.tpl];
			var isShowTime = config.searchConfig.showTime;
			var isShowSearch = config.searchConfig.showKeyWord;


			if (isShowTime || isShowTime === undefined) {
				body.data.start = start;
				body.data.end = end;
				$('.startTime').val(start);
				$('.endTime').val(end);
			} else {
				delete body.data.start;
				delete body.data.end;
			}
			if (!isShowSearch) {// 是否删除 关键字 参数
				delete body.data.keyWord;
			}
			if (body.data.page) {// page置为1
				body.data.page = 1;
			}
			var url = reportApi[reportApi.tpl].url;
			var me = this;
			this.loadData(url, body, function () {
				if ($('.first-coloum-wrap').length > 0) { $('.first-coloum-wrap').remove(); }
				var html = _.template($('#loading-tpl').html());
				$('.tbody').html(html({
					len: $('thead th').length,
					width: $('.table-wrapper').width() / 2
				}));
			}, function (result) {
				if (result.retCode == "000000" && result.data) {
					// if(body.data.hasOwnProperty('page') && body.data.hasOwnProperty('totalSize')){// 针对分页

					// }else{

					// }
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
	window.cacheReportData = {};//缓存一些数据
	var appRouter = new Router();
	Backbone.history.start();


})(window);
