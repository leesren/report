'use strict';
(function(window) {
    var path = new Path();
    var map = path.paraMap(window.location.href);
    var storeId;
    var storeId = map.storeId;
    var brandId = map.brandId;
    var dateType = 4;
    var path = path.getUri('charts');

    initTimevalue(); // 初始化时间
    heightLight();
    loadData(dateType, path, map);

    
    init();
    function init() {
        if (!navigator.userAgent.match(/iPhone|iPod|iPad|Android|ios/i)) {
            $('.table-nav').on('click', '.searchByTime', function(e) {
                $('.time-label .active').removeClass('active');
                search(this);
            });
            $('.table-body').on('click', 'tr', function(e) {
                if (e.currentTarget.nodeName.toLowerCase() == 'tr') {
                    saveDataTolocal(e.currentTarget);
                }
            });
        } else {

            $('.table-nav').on('touchstart', '.searchByTime', function(e) {
                $('.time-label .active').removeClass('active');
                search(this);
            });
            $('.table-body').on('tap', 'tr', function(e) {
                if (e.currentTarget.nodeName.toLowerCase() == 'tr') {
                    saveDataTolocal(e.currentTarget);
                }
            });
        }

    }


    function search(that) {
        toggle(that);
        var dateType = 4;
        loadData(dateType, path, map);
    }
    function loadData(dateType, path, map, segment) {
	        var date = getDate(dateType);
	        var url, queryBody;

	        url = path + 'api/doSta/staStore';

	        var s = segment ? segment.startTime : $('.startTime').val();
	        var e = segment ? segment.endTime : $('.endTime').val();
	        var queryBody = {
	                'device': '11111',
	                'sessionId': '',
	                'account': 'admin',
	                'version': '1.0.0',
	                'data': {
	                    'dateType': dateType,
	                    'date': s + 'to' + e,
	                    'start': s,
	                    'end': e,
                              'storeId': map.storeId,
	                    'brandId': map.brandId
	                }
	            };
	        $.ajax({
	            url: url,
	            data: JSON.stringify(queryBody),
	            dataType: 'json',
	            type: 'post',
	            contentType: 'application/json; charset=utf-8',
	            beforeSend: function() {
	                showLoading();
	            },
	            success: function(data) {
	                if (data && data['retMsg'] == 'success') {

	                    var timer = setTimeout(function() {
	                        console.log(data['data'].length);
	                        if (data['data'].length == 0) {
	                            showNoData();
	                            $('.description .sale').html('0.00 ');
	                            clearTimeout(timer);
	                            return;
	                        }
	                        showUser(data['data']);
	                        clearTimeout(timer);
	                    }, 500);
	                }
	            },
	            error: function(XMLHttpRequest, textStatus, errorThrown) {
	                alert('加载失败');

	            }
	        });
    }

    /**
    * 初始化 时间 为当前时间
    */
    function initTimevalue() {
        var endtime = getDate(0);
        var starttime = endtime;
        $('.endTime').val(endtime);
        $('.startTime').val(starttime);
    }
    /**
    * 时间格式处理 为 ffff-mm-dd
    * @para string 时间类型 年月日
    * @return  ffff-mm-dd 格式
    */
    function getDate(dataType) {
            var d = new Date();
            var f;
            var mon = d.getMonth() + 1;
            var day = d.getDate();
            switch (dataType) {

                case 0:
                    {
                        f = d.getFullYear() + "-" + (mon > 9 ? mon : '0' + mon) + "-" + (day > 9 ? day : '0' + day);
                        break;
                    }
                case 1:
                    {
                        f = d.getFullYear() + "-" + (mon > 9 ? mon : '0' + mon);
                        break;
                    }
                case 2:
                    {
                        f = d.getFullYear();
                        break;
                    }
            }
            return f;
    }

    // 切换 active
    function toggle(that,list){
            var list = list  ? list : $('.time-label span');
            var i = $(that).index();
            list.map(function(index,el){
                if(i == index){
                    $(that).addClass('active');
                }else{
                    $(el).removeClass('active');
                }
            });
    }
    function heightLight() {
            function handleClick(e) {
                $('.time-label span').removeClass('active');
                $(e.target).addClass('active');
                var index = $(e.target).data('time');
                var segment;
                if (index == 'week') {
                    segment = dateSegment('week');
                } else if (index == 'month') {
                    segment = dateSegment('month');
                } else if (index == 'year') {
                    segment = dateSegment('year');
                } else if (index == 'day') {
                    segment = dateSegment('day');
                } else if (index == 'all') {
                    segment = dateSegment('all');
                }
                loadData(dateType, path, map, segment);
            }
            if (!navigator.userAgent.match(/iPhone|iPod|iPad|Android|ios/i)) {
                $('.time-label').on('click', 'span', function(e) {
                    handleClick(e);
                });
            } else {

                $('.time-label').on('tap', 'span', function(e) {
                    handleClick(e);
                });
            }
    }
    
    // 展示loading 模板
    function showLoading() {
        render($('#loading-tpl').html());
    }
    // 展示没有数据模板
    function showNoData() {
        var html = _.template($('#nodata-tpl').html());
        var dom = html({});
        render(dom);
    }

    function showComsume(arr) {
        var html = _.template($('#comsume-tpl').html());
        var dom = html({
            data: arr
        });
        render(dom);
    }

    function showSale(arr) {

        var html = _.template($('#sale-tpl').html());
        var dom = html({
            data: arr
        });
        render(dom);
    }

    /**
    * 根据User 展示不同的模板
    * @arr 展示数据
    */
    function showUser(arr){
        var temp;
        // 店铺销售和消耗
        temp = 'store-tpl';
        var html = _.template($('#'+temp).html());
        var dom = html({
            data: arr
        });
        render(dom);
    }
	function saveDataTolocal(target) {
		var localdata = {};
		var el = $(target).find('td');
		localdata.name = $(el[0]).text().trim();
		localdata.sales = $(el[1]).text().trim();
		localdata.sellnumber = $(el[2]).text().trim();
		localdata.consume = $(el[3]).text().trim();
		localdata.consumeNumber = $(el[4]).text().trim();
		localdata.cNumber = $(el[5]).text().trim();
		localdata.pNumber = $(el[6]).text().trim();

		var text = JSON.stringify(localdata);
		if (window.localStorage.storeInfo) {
			window.localStorage.removeItem('storeInfo');
		}
		window.localStorage.storeInfo = text;
		toggle(target,$(target).parent().find('tr'));
		window.setTimeout(function() {
			window.location.href = 'page3.html?storeId=' + ($(target).attr('data-store'));
		}, 600);
	}
    /**
    * 渲染dom
    * @para  string  dom字符
    */
    function render(dom) {
        $('.table-body').html(dom);
    }
    /*
    *   时间段筛选
    *   @type string 获取的时间段  分 今日-7天-当月-当年
    *   @return Object 返回开始和结束的时间段
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
                                dateTemp = myDate.getFullYear() + '-' + ((myDate.getMonth() + 1) >9 ? (myDate.getMonth() + 1) : '0'+(myDate.getMonth() + 1)) + '-' + (myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate());
                                dateArray.push(dateTemp);
                                myDate.setDate(myDate.getDate() + flag);
                            }
                            break;
                        }
                    case 'month':
                        {
                            myDate = new Date();
                            var temp = myDate.getFullYear() + '-' + ((myDate.getMonth() + 1) >9 ? (myDate.getMonth() + 1) : '0'+(myDate.getMonth() + 1)) ;
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
                            var day = getDate(0);
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
})(window);