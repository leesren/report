'use strict';
(function(window) {
    function lastMonth(date) {
        var dd = date ? new Date(date) : new Date(),
            year = dd.getFullYear(),
            month = dd.getMonth() > 9 ? dd.getMonth() + 1 : '0' + (dd.getMonth() + 1),
            day = dd.getDate(),
            monthFirstDay = new Date(year + '-' + month + '-' + '01'),
            oneDay = 24 * 60 * 60 * 1000;
        var lastMonthLastDayDate = new Date(monthFirstDay - oneDay);
        var y = lastMonthLastDayDate.getFullYear(),
            m = lastMonthLastDayDate.getMonth() > 9 ? lastMonthLastDayDate.getMonth() + 1 : '0' + (lastMonthLastDayDate.getMonth() + 1),
            d = lastMonthLastDayDate.getDate();
        return {
            startTime: y + '-' + m + '-01',
            endTime: y + '-' + m + '-' + d
        }
    }
    /**
     * 时间段设置   一周     
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
                        dateTemp = myDate.getFullYear() + '-' + ((myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1) : ('0' + (myDate.getMonth() + 1))) + '-' + (myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate());
                        dateArray.push(dateTemp);
                        myDate.setDate(myDate.getDate() + flag);
                    }
                    break;
                }
            case 'month':
                {
                    myDate = new Date();
                    var temp = myDate.getFullYear() + '-' + ((myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1) : ('0' + (myDate.getMonth() + 1)));
                    var day1 = temp + '-' + '01';
                    var day2 = (myDate.getFullYear() + '-' + ((myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1) : ('0' + (myDate.getMonth() + 1))) + '-' + (myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate()));
                    dateArray.push(day1);
                    dateArray.push(day2);
                    break;
                }
            case 'year':
                {
                    myDate = new Date();
                    var day1 = myDate.getFullYear() + '-01-01';
                    var day2 = myDate.getDate(0);
                    dateArray.push(day1);
                    dateArray.push(day2);
                    break;
                }
            case 'day':
                {
                    myDate = new Date();
                    var day = (myDate.getFullYear() + '-' + ((myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1) : ('0' + (myDate.getMonth() + 1))) + '-' + (myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate()));
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
            case 'lastMonth':
                {
                    dateArray.length = 0;
                    var lastMonthDate = lastMonth();
                    dateArray.push(lastMonthDate.startTime);
                    dateArray.push(lastMonthDate.endTime);
                    break;
                }
        }
        return {
            startTime: dateArray[0],
            endTime: dateArray[dateArray.length - 1]
        }
    }

    var path = new Path();
    var uri = path.getUri('charts');
    // var uri = 'http://localhost:3088/';
    var map = path.paraMap(window.location.href);
    var time = dateSegment('week');
    var day = dateSegment('day');
    var month = dateSegment('month');
    var lastMonthDate = dateSegment('lastMonth');
    var noteText = '表格太长可以拖动';
    var nowDate = new Date();
    var nowMonth = nowDate.getMonth() + 1;
    var nowMonthFormat = nowMonth < 10 ? '0' + nowMonth : nowMonth;
    var thisMonth = nowDate.getFullYear() + '-' + nowMonthFormat;
    /*
     * 初始化 时间组件
     * 默认一周 时间间隔
     * @para time 开始和结束时间
     */
    function initTime(time) {
        var gap = (!time || time === 'today' || time === 'day') ? 'day' : time;
        var date = dateSegment(gap);
        if (map.start) {
            $('.startTime').val(map.start);
        } else {
            $('.startTime').val(date.startTime);
        }
        if (map.end) {
            $('.endTime').val(map.end);
        } else {
            $('.endTime').val(date.endTime);
        }
    }

    var api = {
        base: {
            'device': (map.device ? map.device : ''),
            'sessionId': (map.sessionId ? map.sessionId : ''),
            'account': (map.account ? map.account : 'admin'),
            'version': (map.version ? map.version : '1.0.0'),
        },
        queryString: map,
        tpl: map.tpl,
        reportEmp: { // 员工报表
            url: uri + 'api/doReport/reportEmp',
            body: {
                data: {
                    'storeId': (map.storeId === undefined ? '' : map.storeId),
                    'empId': (map.empId === undefined ? '' : map.empId),
                    'keyWord': '',
                    'start': (map.start === undefined ? time.startTime : map.start),
                    'end': (map.end === undefined ? time.endTime : map.end),
                    'bcOnly': "1",
                    'orderName': 'consumeCom',
                    'orderType': 'desc'
                }
            },
            summary: {
                key: ['销售业绩总额', '消耗业绩总额', '手工工资总额', '提成合计'],
                value: ['salesAch', 'consumeAch', 'manualCom', 'sumCom']
            },
            searchConfig: {
                showKeyWord: true,
                keyWord: ['员工姓名'],
                time: 'week',
                showCheckbox: {
                    text: "只显示美容师与顾问",
                    param: "bcOnly",
                    checked: true,
                    checkedVal: "1",
                    checkVal: ""
                }
            },
            note: {
                text: noteText
            }
        },
        reportEmpSaleDetail: { // 员工销售业绩详情
            url: uri + 'api/doReport/reportEmpSalesDetail',
            body: {
                data: {
                    'empId': (map.empId === undefined ? '' : map.empId),
                    'start': (map.start === undefined ? time.startTime : map.start),
                    'end': (map.end === undefined ? time.endTime : map.end),
                    "storeId": (map.storeId),
                    "keyWord": "",
                    "type": "" // 类型搜索
                }
            },
            summary: {
                key: ['销售业绩总额', '销售提成总额'],
                value: ['sales', 'commission']
            },
            searchConfig: {
                showKeyWord: true,
                keyWord: ['项目', '类型'],
                time: 'week'
            },
            note: {
                text: '搜索支持【关键字+类型】如: 美白 家居'
            }
        },
        reportArrearDetail: { // 欠款详情
            url: uri + 'api/doReport/reportArrearDetail',
            body: {
                data: {
                    'empId': (map.empId === undefined ? '' : map.empId),
                    'storeId': (map.storeId === undefined ? '' : map.storeId),
                    'keyWord': ''
                }
            },
            summary: {
                key: ['应收总额', '实收总额', '欠款总额'],
                value: ['allMoney', 'recivedMoney', 'restMoney']
            },
            searchConfig: {
                showTime: false,
                showKeyWord: true,
                keyWord: ['客户', '顾问'],
                showTip: {
                    text: "<i class='red-block'></i>红色代表销户用户"
                }
            },
            note: {
                text: noteText
            }
        },
        reportEmpComDetail: { // 员工消耗业绩详情
            url: uri + 'api/doSta/staEmpConDetail',
            body: {
                data: {
                    'empId': (map.empId === undefined ? '' : map.empId),
                    'start': (map.start === undefined ? time.startTime : map.start),
                    'end': (map.end === undefined ? time.endTime : map.end),
                    "storeId": map.storeId,
                    "dateType": 4,
                }
            },
            summary: {
                key: ['消耗业绩总额', '消耗提成总额', '手工工资', '消耗数量'],
                value: ['consume', 'commission', 'extrawage', 'consumeNumber']
            },
            searchConfig: {
                showKeyWord: false,
                time: 'week'
            },
            note: {
                text: noteText
            }
        },
        reportCustomer: { // 客户报表
            url: uri + 'api/doReport/reportCustomer',
            body: {
                data: {
                    'storeId': (map.storeId),
                    'empId': (map.empId),
                    'id': map.id,
                    'keyWord': '',
                    'start': (map.start === undefined ? time.startTime : map.start),
                    'end': (map.end === undefined ? time.endTime : map.end),
                    'orderName': 'sales',
                    'orderType': 'desc'
                }
            },
            summary: {
                key: ['销售业绩总额', '消耗业绩总额'],
                value: ['sales', 'consume']
            },
            searchConfig: {
                showKeyWord: true,
                time: 'week',
                keyWord: ['会员姓名', '会员编号']
            },
            note: {
                text: noteText
            }
        },
        reportTotalDebt: { // 客户负债报表
            url: uri + 'api/doReport/reportTotalDebt',
            body: {
                'data': {
                    'storeId': (map.storeId === undefined ? '' : map.storeId),
                    'empId': (map.empId === undefined ? '' : map.empId),
                    'keyWord': '',
                    'orderName': 'sumAmount',
                    'orderType': 'desc'
                }
            },
            summary: {
                key: ['赠送合计总额', '合计总额', '欠款总额'],
                value: ['giftAmount', 'sumAmount', 'debtMoney']
            },
            searchConfig: {
                showKeyWord: true,
                showTime: false,
                time: 'week',
                keyWord: ['会员名称', '会员编号']
            },
            note: {
                text: noteText
            }
        },
        reportProduct: { // 产品汇总
            url: uri + 'api/doReport/reportProduct',
            body: {
                'data': {
                    'storeId': (map.storeId === undefined ? '' : map.storeId),
                    'start': (map.start === undefined ? day.startTime : map.start),
                    'end': (map.end === undefined ? day.endTime : map.end),
                    'keyWord': '',
                    'orderName': 'sales',
                    'orderType': 'desc'
                }
            },
            summary: {
                key: ['销售业绩总额', '消耗业绩总额'],
                value: ['sales', 'consumes']
            },
            searchConfig: {
                showKeyWord: true,
                time: 'today'
            },
            note: {
                text: noteText
            }

        },
        reportCard: { //卡项负债
            url: uri + 'api/doReport/reportCard',
            body: {
                'data': {
                    'storeId': (map.storeId === undefined ? '' : map.storeId),
                    'empId': (map.empId === undefined ? '' : map.empId),
                    'keyWord': '',
                    'orderName': 'totalNumber',
                    'orderType': 'desc'
                }
            },
            summary: {
                key: ['总数量', '未消耗总额'],
                value: ['totalNumber', 'restCardAmount']
            },
            searchConfig: {
                showTime: false,
                time: 'week',
                showKeyWord: true,
                keyWord: ['项目名称']
            },
            note: {
                text: noteText
            }
        },
        reportCardDetail: { //卡项负债明细
            url: uri + 'api/doReport/reportCardDetail',
            body: {
                'data': {
                    'keyWord': '',
                    'storeId': (map.storeId === undefined ? '' : map.storeId),
                    'empId': (map.empId === undefined ? '' : map.empId),
                    'name': (map.name === undefined ? '' : decodeURI(map.name))
                }
            },
            summary: {
                key: ['数量'],
                value: ['length']
            },
            searchConfig: {
                showTime: false,
                time: 'week',
                showKeyWord: true,
                keyWord: ['会员名']
            },
            note: {
                text: noteText
            }
        },
        reportAreaRefund: { // 退款报表汇总
            url: uri + 'api/doAreaReport/reportAreaRefund',
            body: {
                'data': {
                    "orgId": (map.organizationId === undefined ? '' : map.organizationId),
                    'start': (map.start === undefined ? time.startTime : map.start),
                    'end': (map.end === undefined ? time.endTime : map.end)
                }
            },
            summary: {
                key: [],
                value: []
            },
            searchConfig: {
                showTime: true,
                time: 'week',
                showKeyWord: false,
                keyWord: ['会员名']
            },
            note: {
                text: noteText
            }
        },
        reportRefund: { // 退款报表
            url: uri + 'api/doReport/reportRefund',
            body: {
                'data': {
                    'keyWord': '',
                    'storeId': (map.storeId === undefined ? '' : map.storeId),
                    'start': (map.start === undefined ? time.startTime : map.start),
                    'end': (map.end === undefined ? time.endTime : map.end)
                }
            },
            summary: {
                key: ['退款金额（现金）汇总', '退款金额（会员卡）汇总', '退款金额（金额卡）汇总'],
                value: ['cashPaySum', 'balancePaySum', 'productPaySum']
            },
            searchConfig: {
                showTime: true,
                time: 'week',
                showKeyWord: true,
                keyWord: ['会员名', '产品名']
            },
            note: {
                text: noteText
            }
        },
        reportWorkDetail: { //工单明细 消耗单明细
            url: uri + 'api/doReport/reportWorkDetail',
            body: {
                'data': {
                    'brandId': (map.organizationId === undefined ? '' : map.organizationId),
                    'storeId': (map.storeId === undefined ? '' : map.storeId),
                    'empId': (map.empId === undefined ? '' : map.empId),
                    'customerId': (map.customerId === undefined ? '' : map.customerId),
                    'cempId': map.cempId,
                    'keyWord': '',
                    'eValue': map.eValue,
                    'start': (map.start === undefined ? day.startTime : map.start),
                    'end': (map.end === undefined ? day.endTime : map.end),
                    'page': 1,
                    'size': 20
                }
            },
            summary: map.organizationId === undefined ? {
                key: ['消耗业绩总额', '消耗业绩', '消耗提成', '手工工资', '赠送消耗'],
                value: ['storeConsume', 'workEmpList-consumeAch', 'workEmpList-commission', 'workEmpList-extrawage'],
                serverValue: ['sumConsume', 'sumCA', 'sumCC', 'sumEx', 'sumGiftConsume']

            } : {
                key: [],
                value: [],
                serverValue: []
            },
            searchConfig: {
                showKeyWord: true,
                time: 'today',
                keyWord: ['会员名称', '会员编号', '员工名称', '项目名称']
            },
            note: {
                text: noteText
            }
        },
        reportMarketDetail: { // 销售明细
            url: uri + 'api/doReport/reportMarketDetail',
            body: {
                'data': {
                    'brandId': (map.organizationId === undefined ? '' : map.organizationId),
                    'storeId': (map.storeId === undefined ? '' : map.storeId),
                    'empId': (map.empId === undefined ? '' : map.empId),
                    'customerId': (map.customerId === undefined ? '' : map.customerId),
                    'keyWord': '',
                    'start': (map.start === undefined ? time.startTime : map.start),
                    'end': (map.end === undefined ? time.endTime : map.end),
                    'needConsume': '',
                    'page': 1,
                    'size': 20
                }
            },
            summary: map.organizationId === undefined ? {
                key: ['销售业绩总额', '实收总额', '现金', '银联', '销售提成总额'],
                value: ['sales', 'realRec', 'cashPay', 'unionPay', 'marketEmpList-empSaleCommission'],
                serverValue: ['sumSales', 'sumRec', 'sumCash', 'sumUnion', 'scSum']
            } : {
                key: [],
                value: [],
                serverValue: []
            },
            searchConfig: {
                showKeyWord: true,
                time: 'week',
                keyWord: ['会员名称', '会员编号', '员工名称', '项目名称']
            },
            note: {
                text: '拖动表格'
            }
        },
        reportMarketDetailConsume: { // 订单明细 
            url: uri + 'api/doReport/reportMarketDetail',
            body: {
                'data': {
                    'storeId': (map.storeId === undefined ? '' : map.storeId),
                    'empId': (map.empId === undefined ? '' : map.empId),
                    'customerId': (map.customerId === undefined ? '' : map.customerId),
                    'keyWord': '',
                    'start': (map.start === undefined ? time.startTime : map.start),
                    'end': (map.end === undefined ? time.endTime : map.end),
                    needConsume: '1',
                    'page': 1,
                    'size': 20
                }
            },
            summary: {
                key: ['门店消耗业绩总额', '实收总额', '现金', '银联', '消耗提成总额'],
                value: ['consume', 'realRec', 'cashPay', 'unionPay', 'marketEmpList-empConsumeComission'],
                serverValue: ['sumConsume', 'sumRec', 'sumCash', 'sumUnion', 'ccSum']
            },
            searchConfig: {
                showKeyWord: false,
                time: 'week',
            },
            note: {
                text: noteText
            }
        },
        reportStore: { // 营业报表
            url: uri + 'api/doReport/reportStore',
            body: {
                'data': {
                    'storeId': (map.storeId === undefined ? '' : map.storeId),
                    'start': (map.start === undefined ? time.startTime : map.start),
                    'end': (map.end === undefined ? time.endTime : map.end),
                }
            },
            summary: {
                key: ['销售总额', '消耗总额', '新客总数', '到访人头', '销售目标', '消耗目标'],
                value: ['totalStroeSales', 'totalStoreConsume', 'newNumber', 'arriveSum', 'saleTarget', 'consumeTarget']
            },
            searchConfig: {
                showKeyWord: false,
                time: 'week',
            },
            note: {
                text: '..'
            }
        },
        reportCategory: { // 分类汇总
            url: uri + 'api/doReport/reportCategory',
            body: {
                'data': {
                    'storeId': (map.storeId === undefined ? '' : map.storeId),
                    'start': (map.start === undefined ? day.startTime : map.start),
                    'end': (map.end === undefined ? day.endTime : map.end),
                    'keyWord': '',
                    'orderName': 'sales',
                    'orderType': 'desc'
                }
            },
            summary: {
                key: ['销售业绩总额', '消耗业绩总额'],
                value: ['sales', 'consumes']
            },
            searchConfig: {
                showKeyWord: false,
                time: 'today',
            },
            note: {
                text: noteText
            }
        },
        reportNextCategory: {
            url: uri + 'api/doReport/reportNextCategory',
            body: {
                'data': {
                    "storeId": map.storeId,
                    "id": map.id,
                    "start": time.startTime,
                    "end": time.endTime,
                    "keyWord": ""
                }
            },
            summary: {
                key: ['销售业绩总额', '消耗业绩总额'],
                value: ['sales', 'consumes']
            },
            searchConfig: {
                showKeyWord: true,
                time: 'week',
            },
            note: {
                text: noteText
            }
        },
        reportCustomerCard: { // 客户项卡项负债明细报表
            url: uri + 'api/doReport/reportCustomerCard',
            body: {
                'data': {
                    'storeId': (map.storeId === undefined ? '' : map.storeId),
                    'empId': (map.empId === undefined ? '' : map.empId),
                    'start': (map.start === undefined ? time.startTime : map.start),
                    'end': (map.end === undefined ? time.endTime : map.end),
                    'keyWord': '',
                    'orderName': 'totalNumber',
                    'orderType': 'desc'
                }
            },
            summary: {
                key: ['购买总数量', '剩余次数总量'],
                value: ['totalNumber', 'totalRestTimes']
            },
            searchConfig: {
                time: 'week',
                showTime: false,
                showKeyWord: true,
                keyWord: ['会员名称', '会员编号']

            },
            note: {
                text: noteText + ' 点击查看详情'
            }
        },
        reportCustomerCardDetail: { // 9、客户卡项负债（明细）
            url: uri + 'api/doReport/reportCustomerCardDetail',
            body: {
                'data': {
                    'customerId': (map.customerId === undefined ? '' : map.customerId),
                    'keyWord': '',
                }
            },
            summary: {
                key: ['购买总数量', '剩余总次数'],
                value: ['totalNumber', 'totalRestTimes']
            },
            searchConfig: {
                showKeyWord: true,
                time: 'week',
                showTime: false,
                keyWord: ['项目名称']
            },
            note: {
                text: noteText
            }
        },
        reportBrand: { // 已废除 品牌营业报表
            url: uri + 'api/doReport/reportBrandStores',
            body: {
                'data': {
                    'brandId': (map.organizationId === undefined ? '' : map.organizationId),
                    'keyWord': '',
                    'start': (map.start === undefined ? time.startTime : map.start),
                    'end': (map.end === undefined ? time.endTime : map.end),
                }
            },
            summary: {
                key: ['销售合计总额', '消耗合计总额', '新客总数'],
                value: ['totalStroeSales', 'totalStoreConsume', 'newNumber']
            },
            searchConfig: {
                showKeyWord: false,
                time: 'week',
            },
            note: {
                text: noteText
            }
        },
        reportBrandProduct: { // 已废除 品牌产品汇总
            url: uri + 'api/doReport/reportBrandProduct',
            body: {
                'data': {
                    'brandId': (map.organizationId === undefined ? '' : map.organizationId),
                    'start': (map.start === undefined ? time.startTime : map.start),
                    'end': (map.end === undefined ? time.endTime : map.end),
                    'keyWord': '',
                    'orderName': 'sales',
                    'orderType': 'desc'
                }
            },
            summary: {
                key: ['销售业绩总额', '消耗业绩总额'],
                value: ['sales', 'consumes']
            },
            searchConfig: {
                showKeyWord: false,
                time: 'today'
            },
            note: {
                text: noteText
            }

        },
        reportCustomerArrive: { // 到店排行
            url: uri + 'api/doReport/reportCustomerArrive',
            body: {
                'data': {
                    'storeId': (map.storeId === undefined ? '' : map.storeId),
                    'start': (map.start === undefined ? time.startTime : map.start),
                    'end': (map.end === undefined ? time.endTime : map.end),
                    'empId': map.empId,
                    'keyWord': ''
                }
            },
            summary: {
                key: ['到店总次数', '客户数'],
                value: ['arriveCount', 'length']
            },
            searchConfig: {
                showKeyWord: true,
                time: 'week',
                keyWord: ['名称', '编号']
            },
            note: {
                text: noteText
            }
        },
        reportBrandCoupons: { // 品牌体验券
            url: uri + 'api/doReport/couponBrandPage',
            body: {
                'data': {
                    'orgId': (map.organizationId === undefined ? map.storeId : map.organizationId),
                    // 'start': (map.start === undefined ? day.startTime : map.start),
                    // 'end': (map.end === undefined ? day.endTime : map.end),
                    'keyWord': '',
                    'id': (map.couponId === undefined ? '' : map.couponId)
                }
            },
            summary: {
                key: [],
                value: []
            },
            searchConfig: {
                showKeyWord: true,
                time: 'today',
                keyWord: ['券名', '门店']
            },
            note: {
                text: noteText
            }
        },
        reportStoreCoupons: { // 门店体验券
            url: uri + 'api/doReport/couponBrandPage',
            body: {
                'data': {
                    'orgId': (map.storeId === undefined ? '' : map.storeId),
                    'start': (map.start === undefined ? day.startTime : map.start),
                    'end': (map.end === undefined ? day.endTime : map.end),
                    'keyWord': '',
                    'id': (map.couponId === undefined ? '' : map.couponId)
                }
            },
            summary: {
                key: [],
                value: []
            },
            searchConfig: {
                showKeyWord: true,
                time: 'today',
                keyWord: ['券名']
            },
            note: {
                text: noteText
            }
        },
        reportStoreCouponsDetail: { // 门店体验券详情
            url: uri + 'api/doReport/couponStorePage',
            body: {
                'data': {
                    'orgId': (map.storeId === undefined ? '' : map.storeId),
                    'keyWord': '',
                    'id': (map.couponId === undefined ? '' : map.couponId)
                }
            },
            summary: {
                key: [],
                value: []
            },
            searchConfig: {
                showTime: false,
                showKeyWord: true,
                time: 'today',
                keyWord: ['券号', '会员']
            },
            note: {
                text: noteText
            }
        },
        reportStoreCouponsConsumeDetail: { // 门店体验券消耗详情
            url: uri + 'api/doReport/reportCouponConsumeDetail',
            body: {
                'data': {
                    'orgId': (map.storeId === undefined ? map.organizationId : map.storeId),
                    'start': (map.start === undefined ? day.startTime : map.start),
                    'end': (map.end === undefined ? day.endTime : map.end),
                    'keyWord': '',
                }
            },
            summary: {
                key: [],
                value: []
            },
            searchConfig: {
                showKeyWord: true,
                time: 'today',
                keyWord: ['券名', '券号', '会员']
            },
            note: {
                text: noteText
            }
        },
        reportBrandCard: { //已废除 卡项负债
            url: uri + 'api/doReport/reportBrandCard',
            body: {
                'data': {
                    'brandId': (map.organizationId === undefined ? '' : map.organizationId),
                    'empId': (map.empId === undefined ? '' : map.empId),
                    'keyWord': '',
                    'orderName': 'totalNumber',
                    'orderType': 'desc'
                }
            },
            summary: {
                key: ['总数量', '未消耗总额'],
                value: ['totalNumber', 'restCardAmount']
            },
            searchConfig: {
                showTime: false,
                time: 'week',
                showKeyWord: true,
                keyWord: ['项目名称']
            },
            note: {
                text: noteText
            }
        },
        reportBrandCategory: { // 已废除 品牌分类汇总
            url: uri + 'api/doReport/reportBrandCategory',
            body: {
                'data': {
                    'brandId': (map.brandId === undefined ? '' : map.brandId),
                    'start': (map.start === undefined ? day.startTime : map.start),
                    'end': (map.end === undefined ? day.endTime : map.end),
                    'keyWord': '',
                    'orderName': 'sales',
                    'orderType': 'desc'
                }
            },
            summary: {
                key: ['销售业绩总额', '消耗业绩总额'],
                value: ['sales', 'consumes']
            },
            searchConfig: {
                showKeyWord: false,
                time: 'today',
            },
            note: {
                text: noteText
            }
        }, //品牌接口废除
        reportRcommission: { // 阶梯提成报表 report.html?empId=80&storeId=8491021&tpl=reportRcommission&type=1 //type 1是销售提成，2是消耗提成
            url: uri + 'api/doReport/reportRcommission',
            body: {
                'data': {
                    "storeId": (map.storeId === undefined ? '' : map.storeId),
                    'empId': (map.empId === undefined ? '' : map.empId),
                    "start": lastMonthDate.startTime,
                    "end": lastMonthDate.endTime,
                    "type": map.type, //type 1是销售提成，2是消耗提成
                    "keyWord": ""
                }
            },
            summary: {
                key: [map.type == 1 ? '销售提成总额' : '消耗提成总额'],
                value: ['amount']
            },
            searchConfig: {
                showTime: true,
                time: 'lastMonth',
                showKeyWord: true,
                keyWord: ['员工']
            },
            note: {
                text: '支持月份查询，' + noteText
            }
        },
        areaReportEvalute: { // 星级评分 区域管理报表 report.html?organizationId=3434&tpl=areaReportEvalute&eValue=
            url: uri + 'api/doAreaReport/reportEvalute',
            body: {
                'data': {
                    "orgId": (map.organizationId === undefined ? '' : map.organizationId),
                    "empId": (map.empId === undefined ? '' : map.empId),
                    "eValue": (map.eValue === "" ? '' : map.eValue), // eValue首页不要填，点进去看下一级时需要
                    'start': (map.start === undefined ? day.startTime : map.start),
                    'end': (map.end === undefined ? day.endTime : map.end),
                    "isFirst": (map.eValue === "" ? '1' : '0') // isFirst 进首页是1 ，进详情是0
                }
            },
            summary: {
                key: ['星级总数'],
                value: ['eCount']
            },
            searchConfig: {
                showTime: true,
                time: 'today',
                showKeyWord: false,
                keyWord: ['项目名称']
            },
            note: {
                text: noteText
            }
        },
        areaReportBusiness: { // 区域营业报表  report.html?organizationId=3434&tpl=areaReportBusiness&isFirst=
            url: uri + 'api/doAreaReport/reportBusiness',
            body: {
                'data': {
                    "orgId": (map.organizationId === undefined ? '' : map.organizationId),
                    'start': (map.start === undefined ? time.startTime : map.start),
                    'end': (map.end === undefined ? time.endTime : map.end),
                    "isFirst": (map.isFirst === "" ? '1' : '0') // isFirst 进首页是1 ，进详情是0 // isFirst
                }
            },
            summary: {
                key: ['销售合计总额', '消耗合计总额', '新客总数', '到访人头'],
                value: ['totalStroeSales', 'totalStoreConsume', 'newNumber', 'arriveSum']
            },
            searchConfig: {
                showKeyWord: false,
                time: 'week',
            },
            note: {
                text: noteText
            }
        },
        areaReportCategory: { // 区域品类报表 report.html?organizationId=80755334184&tpl=areaReportCategory&isFirst=
            url: uri + 'api/doAreaReport/reportCategory',
            body: {
                'data': {
                    "orgId": (map.organizationId === undefined ? '' : map.organizationId),
                    "id": (map.id ? map.id : ''),
                    "start": time.startTime,
                    "end": time.endTime,
                    "isFirst": (map.isFirst === "" ? '1' : '0') // isFirst 进首页是1 ，进详情是0 // isFirst
                }
            },
            summary: {
                key: ['销售业绩总额', '消耗业绩总额'],
                value: ['sales', 'consumes']
            },
            searchConfig: {
                showKeyWord: false,
                time: 'week',
            },
            note: {
                text: noteText
            }
        },
        areaReportCard: { // 区域卡项负债报表
            url: uri + 'api/doAreaReport/reportCard',
            body: {
                'data': {
                    "orgId": (map.organizationId === undefined ? '' : map.organizationId),
                    "isFirst": ((map.isFirst === "" || map.isFirst == '1') ? '1' : '0'), // isFirst 进首页是1 ，进详情是0 // isFirst
                    "name": decodeURIComponent((map.name === undefined ? '' : map.name)),
                    "keyWord": ""
                }
            },
            summary: {
                key: ['总数量', '未消耗总额'],
                value: ['totalNumber', 'restCardAmount']
            },
            searchConfig: {
                showTime: false,
                time: 'week',
                showKeyWord: true,
                keyWord: ['项目名称']
            },
            note: {
                text: noteText
            }
        },
        areaReportProduct: { // 区域产品汇总报表
            url: uri + 'api/doAreaReport/reportProduct',
            body: {
                'data': {
                    "orgId": (map.organizationId === undefined ? '' : map.organizationId),
                    "isFirst": ((map.isFirst === "" || map.isFirst == '1') ? '1' : '0'), // isFirst 进首页是1 ，进详情是0 // isFirst
                    "id": (map.id ? map.id : ''),
                    "start": time.startTime,
                    "end": time.endTime,
                    "keyWord": ""
                }
            },
            summary: {
                key: ['销售业绩总额', '消耗业绩总额'],
                value: ['sales', 'consumes']
            },
            searchConfig: {
                showKeyWord: true,
                time: 'today',
                keyWord: ['产品名称']
            },
            note: {
                text: noteText
            }
        },
        reportCustomerSource: { // 客户来源统计报表
            url: uri + 'api/doReport/reportCustomerSource',
            body: {
                'data': {
                    "storeId": (map.storeId === undefined ? '' : map.storeId),
                    "start": time.startTime,
                    "end": time.endTime,
                }
            },
            summary: {
                key: ['销售总额', '消耗总额'],
                value: ['sales', 'consume']
            },
            searchConfig: {
                showKeyWord: false,
                time: 'week'
            },
            note: {
                text: noteText
            }
        },
        reportTakeGoods: { // 取货报表
            url: uri + 'api/doReport/billReport',
            body: {
                'data': {
                    "organizationId": (map.organizationId === undefined ? '' : map.organizationId),
                    "start": time.startTime,
                    "end": time.endTime,
                    "keyWord": ""
                }
            },
            summary: {
                key: [],
                value: []
            },
            searchConfig: {
                showKeyWord: true,
                time: 'week',
                keyWord: ['产品名称']
            },
            note: {
                text: noteText
            }
        },
        reportTakeGoodsDetail: { // 取货报表详情
            url: uri + 'api/doReport/billReportDetail',
            body: {
                'data': {
                    "organizationId": (map.organizationId === undefined ? map.branchId : map.organizationId),
                    "productId": (map.productId === undefined ? '' : map.productId),
                    'start': (map.start === undefined ? time.startTime : map.start),
                    'end': (map.end === undefined ? time.endTime : map.end),
                    "keyWord": ""
                }
            },
            summary: {
                key: ['销售数量', '已取货数量', '剩余数量'],
                value: ['quantity', 'pickQuantity', 'suplusQuantity']
            },
            searchConfig: {
                showKeyWord: true,
                time: 'week',
                keyWord: ['会员名称']
            },
            note: {
                text: noteText
            }
        },
        customerTransOrdersReport: { // 客户临时转店消费记录
            url: uri + 'api/doReport/customerTransOrdersReport',
            body: {
                'data': {
                    "storeId": (map.storeId === undefined ? '' : map.storeId),
                    'start': (map.start === undefined ? time.startTime : map.start),
                    'end': (map.end === undefined ? time.endTime : map.end),
                    "keyWord": ""
                }
            },
            summary: {
                key: [],
                value: []
            },
            searchConfig: {
                showKeyWord: true,
                time: 'week',
                keyWord: ['客户姓名', '客户编号']
            },
            note: {
                text: noteText
            }
        },
        totalInventoryReport: { // 产品总库存
            url: uri + 'api/doWareHouse/monthInvertoryByOrganization',
            body: {
                data: {
                    organizationList: [{
                        organizationId: (map.organizationId === undefined ? '' : map.organizationId)
                    }],
                    keyWord: "",
                    month: (map.start === undefined ? thisMonth : map.start)
                }
            },
            summary: {
                key: [],
                value: []
            },
            searchConfig: {
                showTime: false,
                showMonth: true,
                showKeyWord: true,
                keyWord: ['产品名称', '产品编号'],
                time: 'thisMonth'
            },
            note: {
                text: noteText
            }
        },
        inventoryDetailReport: { // 产品总库存详情
            url: uri + 'api/doWareHouse/monthInvertoryDetailByOrganization',
            body: {
                data: {
                    organizationId: (map.organizationId === undefined ? '' : map.organizationId),
                    productId: (map.productId === undefined ? '' : map.productId),
                    month: (map.start === undefined || map.start === 'undefined' ? thisMonth : map.start),
                    keyWord: ""
                }
            },
            summary: {
                key: [],
                value: []
            },
            searchConfig: {
                showTime: false,
                showMonth: true,
                showKeyWord: true,
                keyWord: ['产品名称', '产品编号'],
                time: 'thisMonth'
            },
            note: {
                text: noteText
            }
        },
        storageInventoryReport: { // 产品分仓库库存
            url: uri + 'api/doWareHouse/monthInvertoryByStorage',
            body: {
                data: {
                    organizationList: [{
                        organizationId: (map.organizationId === undefined ? '' : map.organizationId)
                    }],
                    keyWord: "",
                    month: (map.start === undefined ? thisMonth : map.start)
                }
            },
            summary: {
                key: [],
                value: []
            },
            searchConfig: {
                showTime: false,
                showMonth: true,
                showKeyWord: true,
                keyWord: ['产品名称', '产品编号'],
                time: 'thisMonth'
            },
            note: {
                text: noteText
            }
        },
        storageInventoryDetailReport: { // 产品分仓库库存详情
            url: uri + 'api/doWareHouse/monthInvertoryDetailByStorage',
            body: {
                data: {
                    storageId: (map.storageId === undefined ? '' : map.storageId),
                    organizationId: (map.organizationId === undefined ? '' : map.organizationId),
                    productId: (map.productId === undefined ? '' : map.productId),
                    month: (map.start === undefined || map.start === 'undefined' ? thisMonth : map.start),
                    keyWord: ""
                }
            },
            summary: {
                key: [],
                value: []
            },
            searchConfig: {
                showTime: false,
                showMonth: true,
                showKeyWord: true,
                keyWord: ['产品名称', '产品编号'],
                time: 'thisMonth'
            },
            note: {
                text: noteText
            }
        }

    };
    initTime(api[api['tpl']].searchConfig.time);
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
// &tpl=reportBrandCategory  // 品牌分类汇总
// &tpl=reportBrandProduct // 品牌产品汇总
// &tpl=reportCard // 品牌卡项负债