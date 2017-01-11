'use strict';
(function(window) {
    var path = new Path();
    var map = path.paraMap(window.location.href);
    var storeId, type, customerId, counselorId, beautyId,all,eid;
    storeId = map.storeId;
    beautyId = map.beautyId;
    counselorId = map.counselorId;
    customerId = map.customerId;
    eid = map.eid;
    all = map.all;
    type = map.type;

    var dateType = 4;
    var path = path.getUri('charts');
    initTimevalue(); // 初始化时间
    heightLight();
    if(all == '1'){
           toggle($('span[data-time=all]'));
           var segment = dateSegment('all');
            loadData(dateType, path, storeId, type,segment);

    }else{
         loadData(dateType, path, storeId, type);
    }

    if (!navigator.userAgent.match(/iPhone|iPod|iPad|Android|ios/i)) {
        $('.table-nav').on('click', '.searchByTime', function(e) {
            $('.time-label .active').removeClass('active');
            search(this);
        });
    } else {

        $('.table-nav').on('touchstart', '.searchByTime', function(e) {
             $('.time-label .active').removeClass('active');
            search(this);
        });
    }

    function search(that) {
        toggle(that);
        var dateType = 4;
        loadData(dateType, path, storeId, type);
    }
    function loadData(dateType, path, storeId, type, segment) {
        var date = getDate(dateType);
        var url, queryBody;
        if (type == '1') { // 销售详情
            url = path + 'api/doSta/staSalesDetail';
        } else { // 消耗详情
            url = path + 'api/doSta/staConsumeDetail';
        }

        var empId;
        if (storeId)
            empId = storeId;
        if (beautyId)
            empId = beautyId;
        if (counselorId)
            empId = counselorId;
        if(eid)
            empId = eid;
        if(customerId){
            queryBody = {
                'device': '11111',
                'sessionId': '',
                'account': 'admin',
                'version': '1.0.0',
                'data': {
                    'dateType': dateType,
                    'date': date,
                    'start': segment ? segment.startTime : $('.startTime').val(),
                    'end': segment ? segment.endTime : $('.endTime').val(),
                    'customerId': empId
                }
            };
        }        
        if(storeId){
            queryBody = {
                'device': '11111',
                'sessionId': '',
                'account': 'admin',
                'version': '1.0.0',
                'data': {
                    'dateType': dateType,
                    'date': date,
                    'start': segment ? segment.startTime : $('.startTime').val(),
                    'end': segment ? segment.endTime : $('.endTime').val(),
                    'storeId': empId
                }
            };
        }

        if(eid){
            queryBody = {
                'device': '11111',
                'sessionId': '',
                'account': 'admin',
                'version': '1.0.0',
                'data': {
                    'dateType': dateType,
                    'date': date,
                    'start': segment ? segment.startTime : $('.startTime').val(),
                    'end': segment ? segment.endTime : $('.endTime').val(),
                    'empId': empId
                }
            };
            if (type == '1') { // 销售详情
                url = path + 'api/doSta/staExtrawageDetail';
            }
        }
        if(beautyId || counselorId){
            if (type == '1') { // 销售详情
                url = path + 'api/doSta/staEmpAchDetail';
            } else { // 消耗详情
                url = path + 'api/doSta/staEmpConDetail';
            }
            queryBody = {
                'device': '11111',
                'sessionId': '',
                'account': 'admin',
                'version': '1.0.0',
                'data': {
                    'dateType': dateType,
                    'date': date,
                    'start': segment ? segment.startTime : $('.startTime').val(),
                    'end': segment ? segment.endTime : $('.endTime').val(),
                    'empId': empId
                }
            };
        }

        if (customerId){
            empId = customerId;
            if (type == '1') { // 销售详情
                url = path + 'api/doSta/staSalesDetail';
            } else { // 消耗详情
                url = path + 'api/doSta/staConsumeDetail';
            }
            queryBody = {
                'device': '11111',
                'sessionId': '',
                'account': 'admin',
                'version': '1.0.0',
                'data': {
                    'dateType': dateType,
                    'date': date,
                   'start': segment ? segment.startTime : $('.startTime').val(),
                   'end': segment ? segment.endTime : $('.endTime').val(),
                    'customerId': empId,
                    'storeId':''
                }
            };
        }

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
    function toggle(that){
            var list = $('.time-label span');
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
                loadData(dateType, path, storeId, type, segment);
            }
            if (!navigator.userAgent.match(/iPhone|iPod|iPad|Android|ios/i)) {
                $('.time-label').on('click', 'span', function(e) {
                    handleClick(e);
                });
            } else {

                $('.time-label').on('touchstart', 'span', function(e) {
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
        var length = $('.table-bordered thead th').length;
        var html = _.template($('#nodata-tpl').html());
        var dom = html({len:length});
       $('.table-bordered .tbody').html(dom);
    }

    /**
    * 根据User 展示不同的模板
    * @arr 展示数据
    */
    function showUser(arr){
        var temp;
        // 店铺销售和消耗
        if (beautyId) { // 技师
            if (type == '1') {
                temp = 'beauty-sale-tpl';
            } else {
                temp = 'beauty-comsume-tpl';
            }
        }

        if (counselorId) { // 顾问
            if (type == '1') {

                temp = 'counselor-sale-tpl';
            } else {
                temp = 'counselor-comsume-tpl';
            }
        }    

         if (customerId || storeId) { // 顾客
            if (type == '1') {
                temp = 'customer-sale-tpl';
            } else {
                temp = 'customer-consume-tpl';
            }
        }
        if(eid){
            if (type == '1') {
                temp = 'extrawage-tpl';
            } 
        }

        var html = _.template($('#'+temp).html());
        var dom = html({
            data: arr
        });
        render(dom);
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