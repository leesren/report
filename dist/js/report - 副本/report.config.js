'use strict';
(function(window){
	/**
	* 时间段设置 一周
	* @para  type 时间类型
	* @return Object 旗帜和结束时间
	*/
	function dateSegment(type) {
		var myDate = new Date(); //获取今天日期
		myDate.setDate(myDate.getDate() - 6);
		var dateArray = [];
		var dateTemp;
		var flag = 1;
		switch (type) {
			case 'week':
				{
					for (var i = 0; i < 7; i++) {
						dateTemp = myDate.getFullYear() + '-' + ( (myDate.getMonth()+1) > 9 ? (myDate.getMonth()+1) : ('0'+(myDate.getMonth()+1)) ) + '-' + (myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate());
						dateArray.push(dateTemp);
						myDate.setDate(myDate.getDate() + flag);
					}
					break;
				}
			case 'month':
				{
					myDate = new Date();
					var temp = myDate.getFullYear() + '-' + ( (myDate.getMonth()+1) > 9 ? (myDate.getMonth()+1) : ('0'+(myDate.getMonth()+1)) );
					var day1 = temp + '-' + '01';
					var day2 = getDate(0);
					dateArray.push(day1);
					dateArray.push(day2);
					break;
				}
			case 'year':
				{
					myDate = new Date();
					var day1 = myDate.getFullYear() + '-01-01';
					var day2 = getDate(0);
					dateArray.push(day1);
					dateArray.push(day2);
					break;
				}
			case 'day':
				{
					myDate = new Date();
					var day = (myDate.getFullYear() + '-' + ( (myDate.getMonth()+1) > 9 ? (myDate.getMonth()+1) : ('0'+(myDate.getMonth()+1)) ) + '-' + (myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate()));
					dateArray.push(day);
					dateArray.push(day);
					break;
				}
			case 'all':
				{
					dateArray.push('1999-01-01');
					dateArray.push(getDate(0));
					break;
				}
		}
		return {
			startTime: dateArray[0],
			endTime: dateArray[dateArray.length - 1]
		}
	}
	/*
	* 初始化 时间组件
	* 默认一周 时间间隔
	* @para time 开始和结束时间 
	*/ 
	function initTime(time){
		$('.startTime').val(time.startTime);
		$('.endTime').val(time.endTime);
	}

	var path = new Path();
	var uri = path.getUri('charts');
	var map = path.paraMap(window.location.href);
	var time = dateSegment('week');
	var day = dateSegment('day');
	var noteText = '表格太长可以拖动哦';
	initTime(time);
	var api = {
		base:{
			'device': (map.device ? map.device : '') ,
			'sessionId': (map.sessionId ? map.sessionId :'' ),
			'account':(map.account ? map.account :'admin'),
			'version': (map.version ? map.version : '1.0.0'),
		},
		tpl:map.tpl,
		reportEmp:{// 员工报表
			url:uri+'api/doReport/reportEmp',
			body:{
				data:{
					'storeId': (map.storeId === undefined ? '' : map.storeId),
					'empId': (map.empId === undefined ? '' : map.empId),
					'keyWord': '',
					'start': time.startTime,
					'end': time.endTime,
					'orderName': 'consumeCom',
					'orderType': 'desc'
				}
			},
			summary:{
				key:['销售业绩总额','消耗业绩总额','手工工资总额','提成合计'],
				value:['salesAch','consumeAch','manualCom','sumCom']
			},
			searchConfig:{
				showKeyWord:true,
				keyWord:['员工姓名'],
				time:'week'
			},
			note:{
				text:noteText + '，' + '点击【按钮】查看详情'
			}
		},
		reportEmpSaleDetail:{// 员工销售业绩详情
			url:uri+'api/doReport/reportEmpSalesDetail',
			body:{
				data: {
					'empId': (map.empId === undefined ? '' : map.empId),
					"start":time.startTime,
					"end":time.endTime,
				}
			},
			summary:{
				key:['销售业绩总额','销售提成总额'],
				value:['sales','commission']
			},
			searchConfig:{
				showKeyWord:false
			},
			note:{
				text:noteText
			}
		},
		reportEmpComDetail:{// 员工消耗业绩详情
			url:uri+'api/doSta/staEmpConDetail',
			body:{
				data: {
					'empId': (map.empId === undefined ? '' : map.empId),
					"start":time.startTime,
					"end":time.endTime,
					"dateType":4,
				}
			},
			summary:{
				key:['消耗业绩总额','消耗提成总额','手工工资','消耗数量'],
				value:['consume','commission','extrawage','consumeNumber']
			},
			searchConfig:{
				showKeyWord:false
			},
			note:{
				text:noteText
			}
		},
		reportCustomer:{// 客户报表
			url:uri+'api/doReport/reportCustomer',
			body:{
				data:{
					'storeId': (map.storeId === undefined ? '' : map.storeId),
					'empId': (map.empId === undefined ? '' : map.empId),
					'keyWord': '',
					'start': time.startTime,
					'end': time.endTime,
					'orderName': 'sales',
					'orderType': 'desc'
				}
			},
			summary:{
				key:['销售业绩总额','消耗业绩总额'],
				value:['sales','consume']
			},
			searchConfig:{
				showKeyWord:true,
				time:'week',
				keyWord:['会员姓名','会员编号']
			},
			note:{
				text:noteText
			}
		},
		reportTotalDebt:{// 客户负债报表
			url:uri+'api/doReport/reportTotalDebt',
			body:{
				'data': {
					'storeId': (map.storeId === undefined ? '' : map.storeId),
					'empId': (map.empId === undefined ? '' : map.empId),
					'keyWord': '',
					'orderName': 'sumAmount',
					'orderType': 'desc'
				}
			},
			summary:{
				key:['赠送合计总额','合计总额','欠款总额'],
				value:['giftAmount','sumAmount','debtMoney']
			},
			searchConfig:{
				showKeyWord:true,
				showTime:false,
				time:'week',
				keyWord:['会员名称','会员编号']
			},
			note:{
				text:noteText
			}
		},
		reportProduct:{// 产品汇总
			url:uri+'api/doReport/reportProduct',
			body:{
				'data': {
					'storeId': (map.storeId === undefined ? '' : map.storeId),
					'start': day.startTime,
					'end': day.endTime,
					'keyWord': '',
					'orderName': 'sales',
					'orderType': 'desc'
				}
			},
			summary:{
				key:['销售业绩总额','消耗业绩总额'],
				value:['sales','consumes']
			},
			searchConfig:{
				showKeyWord:false,
				time:'today'
			},
			note:{
				text:noteText
			}
			
		},
		reportCard:{//卡项负债
			url:uri+'api/doReport/reportCard',
			body:{
				'data': {
					'storeId': (map.storeId === undefined ? '' : map.storeId),
					'empId': (map.empId === undefined ? '' : map.empId),
					'keyWord': '',
					'orderName': 'totalNumber',
					'orderType': 'desc'
				}
			},
			summary:{
				key:['总数量','未消耗总额'],
				value:['totalNumber','restCardAmount']
			},
			searchConfig:{
				showTime:false,
				time:'week',
				showKeyWord:true,
				keyWord:['项目名称']
			},
			note:{
				text:noteText
			}
		},
		reportWorkDetail:{//工单明细 
			url:uri+'api/doReport/reportWorkDetail',
			body:{
				'data': {
					'storeId': (map.storeId === undefined ? '' : map.storeId),
					'empId': (map.empId === undefined ? '' : map.empId),
					'keyWord': '',
					'start': time.startTime,
					'end': time.endTime
				}
			},
			summary:{
				key:['门店消耗业绩总额','消耗业绩','消耗提成','手工工资'],
				value:['storeConsume','workEmpList-consumeAch','workEmpList-commission','workEmpList-extrawage'],

			},
			searchConfig:{
				showKeyWord:true,
				time:'week',
				keyWord:['会员名称','会员编号','员工名称','项目名称']
			},
			note:{
				text:noteText
			}
		},
		reportMarketDetail:{// 订单明细 销售明细
			url:uri+'api/doReport/reportMarketDetail',
			body:{
				'data': {
					'storeId': (map.storeId === undefined ? '' : map.storeId),
					'empId': (map.empId === undefined ? '' : map.empId),
					'keyWord': '',
					'start': time.startTime,
					'end': time.endTime,
					needConsume:''
				}
			},
			summary:{
				key:['门店销售业绩总额','实收总额','现金','银联','销售提成总额'],
				value:['sales','realRec','cashPay','unionPay','marketEmpList-empSaleCommission']
			},
			searchConfig:{
				showKeyWord:true,
				time:'week',
				keyWord:['会员名称','会员编号','员工名称','项目名称']
			},
			note:{
				text:noteText
			}
		},
		reportMarketDetailConsume:{
			url:uri+'api/doReport/reportMarketDetail',
			body:{
				'data': {
					'storeId': (map.storeId === undefined ? '' : map.storeId),
					'empId': (map.empId === undefined ? '' : map.empId),
					'keyWord': '',
					'start': time.startTime,
					'end': time.endTime,
					needConsume:'1'
				}
			},
			summary:{
				key:['门店消耗业绩总额','实收总额','现金','银联','消耗提成总额'],
				value:['consume','realRec','cashPay','unionPay','marketEmpList-empConsumeComission']
			},
			searchConfig:{
				showKeyWord:false,
				time:'week',
			},
			note:{
				text:noteText
			}
		},
		reportStore: { // 营业报表
			url: uri + 'api/doReport/reportStore',
			body: {
				'data': {
					'storeId': (map.storeId === undefined ? '' : map.storeId),
					'start': time.startTime,
					'end': time.endTime
				}
			},
			summary:{
				key:['销售合计总额','消耗合计总额','新客总数' ],
				value:['totalStroeSales','totalStoreConsume','newNumber']
			},
			searchConfig:{
				showKeyWord:false,
				time:'week',
			},
			note:{
				text:noteText
			}
		},		
		reportCategory: { // 分类汇总
			url: uri + 'api/doReport/reportCategory',
			body: {
				'data': {
					'storeId': (map.storeId === undefined ? '' : map.storeId),
					'start': day.startTime,
					'end': day.endTime,
					'keyWord': '',
					'orderName': 'sales',
					'orderType': 'desc'
				}
			},
			summary:{
				key:['销售业绩总额','消耗业绩总额'],
				value:['sales','consumes']
			},
			searchConfig:{
				showKeyWord:false,
				time:'today',
			},
			note:{
				text:noteText
			}
		},
		reportCustomerCard:{// 客户项卡项负债明细报表
			url: uri + 'api/doReport/reportCustomerCard',
			body: {
				'data': {
					'storeId': (map.storeId === undefined ? '' : map.storeId),
					'empId': (map.empId === undefined ? '' : map.empId),
					'start': time.startTime,
					'end': time.endTime,
					'keyWord': '',
					'orderName': 'totalNumber',
					'orderType': 'desc'
				}
			},
			summary:{
				key:['购买总数量','剩余次数总量'],
				value:['totalNumber','totalRestTimes']
			},
			searchConfig:{
				time:'week',
				showTime:false,
				showKeyWord:true,
				keyWord:['会员名称','会员编号']
				
			},
			note:{
				text:noteText + ' 点击查看详情'
			}
		},		
		reportCustomerCardDetail:{// 9、客户卡项负债（明细）
			url: uri + 'api/doReport/reportCustomerCardDetail',
			body: {
				'data': {
					'customerId':(map.customerId === undefined ? '' : map.customerId),
					'keyWord': '',
				}
			},
			summary:{
				key:['购买总数量','剩余总次数'],
				value:['totalNumber','totalRestTimes']
			},
			searchConfig:{
				showKeyWord:true,
				time:'week',
				showTime:false,
				keyWord:['会员名称','会员编号','项目名称']
			},
			note:{
				text:noteText
			}
		},
		reportBrandStores:{// 9、品牌
			url: uri + 'api/doReport/reportBrandStores',
			body: {
				'data': {
					'customerId':(map.customerId === undefined ? '' : map.customerId),
					'keyWord': '',
				}
			},
			summary:{
				key:['购买总数量','剩余总次数'],
				value:['totalNumber','totalRestTimes']
			},
			searchConfig:{
				showKeyWord:true,
				time:'week',
				showTime:false,
				keyWord:['会员名称','会员编号','项目名称']
			},
			note:{
				text:noteText
			}
		}
		

	};
	window.reportApi = api;
})(window);

// &tpl=reportEmp // 员工报表
// &tpl=reportCustomer // 客户报表
// &tpl=reportTotalDebt //客户负债报表
// &tpl=reportProduct // 产品汇总
// &tpl=reportCard //卡项负债
// &tpl=reportWorkDetail //工单明细
// &tpl=reportMarketDetail // 订单明细
// &tpl=reportStore  // 营业报表
// &tpl=reportCategory  // 分类汇总
// &tpl=reportCustomerCard // 客户项卡项负债明细报表
