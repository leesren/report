        

requirejs.config({
    baseUrl: 'dist/lib',
    paths: {
        backbone: 'backbone/backbone-min',
        underscore: 'underscore/underscore-min',
        jquery: 'jquery/jquery.min',
        bluetheme: 'echarts/dist/theme/blue',
        macaronstheme: 'echarts/dist/theme/macarons',
        helianthustheme: 'echarts/dist/theme/helianthus',

    },
    shim: {
        jquery: {
            exports: '$'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

requirejs(['backbone',
    'bluetheme',
    '../js/data.template',
    '../js/pathHandle',
    'macaronstheme'
    ],function(Backbone,bluetheme,tmpl,PathMap,helianthustheme){

        tmpl.basebar_h.title  = {text: '销售情况'};
        tmpl.basebar_h.tooltip  = { trigger: 'axis'};
        tmpl.basebar_h.legend = { data:['销售','消耗']};    
    var V = Backbone.View.extend({
        el:'body',
        initialize:function(obj){
            this.queryPara = obj.queryPara;
            this.url = obj.url;
            this.echarts = obj.echarts; 
            this.mychart = this.echarts.init(document.getElementById('p3-chart-content'),helianthustheme);
            // this.piechart = this.echarts.init(document.getElementById('pie-chart'),bluetheme);
            this.consumepie = this.echarts.init(document.getElementById('consume-pie-chart'),helianthustheme);
            this.salepie = this.echarts.init(document.getElementById('sale-pie-chart'),helianthustheme);
            this.option = obj.option;
            this.oppie = obj.oppie;
            this.isLoadedinfo = obj.isLoadedinfo;
            this.storeId = obj.storeId;
            var me = this;
            this.barNavType = 0;// 条形图导航索引值
            this.datainfo = obj.datainfo;
            this.initStoreInfo();
            this.loadData(function(data,status){
                me.handlerResult(data,status,me,'bar');

                me.loadData(function(data,status){
                    me.handlerResult(data,status,me,'pie');
                },'pie');
                
            },'bar');   
            this.drawbackTime = 1;
            var delayLoaddrawback = setTimeout(function(){// 加载钱款列表

                me.loadData(function(data,status){
                    me.handlerResult(data,status,me,'refound');
                },'refound');
                clearTimeout(delayLoaddrawback);
            },100);     

            var delayLoad2 = setTimeout(function(){
                me.loadData(function(data,status){
                    me.handlerResult(data,status,me,'debt');
                },'debt');
                clearTimeout(delayLoad2);
            },200);
            
        },
        events:{
            'touchstart  .pietime':'selectPieTimeType',
            'touchstart  .bartime':'selectBarTimeType',
            'click  .refound':'selectRefoundTimeType',
            'touchstart .tap-icon1 ul li':'selectSaleType',
            'touchstart .show':'moreInfo',
            'touchstart .item':'tapli'
        },
        initStoreInfo: function() {
            if (!this.isLoadedinfo && window.localStorage.storeInfo) {
                var localData = {
                    result: "SUCCESS",
                    data: JSON.parse(window.localStorage.storeInfo)
                };
                var temp = _.template($("#store-tmpl").html(), {
                        variable: 'data'
                    }),
                    html = temp(localData);
                $(".top-nav").html(html);
                this.isLoadedinfo = true;

                $(".toggle-nav").css({
                    opacity: 1
                });
                $(".tap-icon2").css({
                    opacity: 1
                });
                // $(".bartime").css({opacity:1});
            }
        },
        render:function(res,ty){
            
           
            // try{
                
                switch(ty){
                    case "bar":{

                        var bar_data1,bar_data2;
                        if(this.barNavType === 0){ 
                            this.base = {title:'销售消耗业绩情况',legend1:'销售业绩',legend2:'消耗业绩'};
                            bar_data1 = this.option.sales;
                            bar_data2 = this.option.consume;
                        }else if(this.barNavType === 1){
                            this.base = {title:'销售消耗项目量情况',legend1:'销售项目量',legend2:'消耗项目量'};
                            bar_data1 = this.option.sellnumber;
                            bar_data2 = this.option.projectNumber;
                        }else if(this.barNavType === 2){
                            this.base = {title:'客户量情况',legend1:'人次',legend2:'人头'};
                            bar_data1 = this.option.cNumber;
                            bar_data2 = this.option.pNumber;
                        }
                        this.changeChart(this.base,
                            this.option.date,
                            {
                                name:this.base.legend1,
                                data:bar_data1
                            },
                            {
                                name:this.base.legend2,
                                data:bar_data2
                            }
                        );
                        break;
                    }                   
                    case "pie":{
                        var pie = {
                                title:'项目销售占比',
                                trigger:'item',
                                legend:{ orient : 'vertical',x : 'left',data:['销售','消耗']},
                                data:res.data
                         }
                        this.showPie(pie);
                        break;
                    }
                    case 'drawback':{
                        this.showDrawBacklist();
                        break;
                    }   
                    case 'debt':{
                        this.showDebtlist();
                        break;
                    }
                    case 'refound':{
                        this.showDrawBacklist();
                        break;
                    }
                }

            // }catch(e){
            //  this.log("图表出错了"+e);
            // }

        },
        showDrawBacklist:function(){
            
            if(this.drawbackdata.retMsg === 'success'){

                if(this.drawbackdata.data.length>0){
                    var temp = _.template($("#drawback-tmpl").html(),{variable: 'data'});
                    var html = temp(this.drawbackdata);
                    $(".p3-refound ul").html(html);
                }else{
                    var temp = _.template($("#nodata-tmpl-refound").html());
                    var html = temp({msg:'暂时没有数据...'});
                    $(".p3-refound ul").html(html);
                }
                
            }
        },
        showDebtlist:function(){

            if(this.debtdata.retMsg === 'success'){

                    if(this.debtdata.data.length>0){
                        $(".p3-dept ul").html("");
                        var temp = _.template($("#debt-tmpl").html(),{variable: 'data'});
                        if(this.debtdata.retMsg === 'success'){
                        var html = temp(this.debtdata);
                        $(".p3-dept ul").html(html);
                
                        }
                    }else{
                        var temp = _.template($("#nodata-tmpl-debt").html());
                        var html = temp({msg:'暂时没有数据...'});
                        $(".p3-dept ul").html(html);
                    }   
                }   
        
        },
        showPie:function(obj){

            

            this.pieDataArray = this.handlePieData();// 挂载到Backbone下面
            var name = this.pieDataArray.sale.map(function(el) {
                return el.name;
            });
            var saleOp = this.setPieOption({
                title:{
                        text:'销售项目占比',
                        x:'center',
                        textAlign:'right'
                },
                legend:{
                    orient: 'vertical',
                    x: 'left',
                    data: []
                },
                series:{
                    name:'百分比',
                    data:this.pieDataArray.sale
                }
            });         

            var consumeOp = this.setPieOption({
                title:{
                        text:'消耗项目占比',
                        x:'center',
                        textAlign:'right'
                },
                legend:{
                    data:[]
                },
                series:{
                    name:'百分比',
                    data:this.pieDataArray.consume
                }
            });      

            this.salepie.setOption(saleOp);
            this.consumepie.setOption(consumeOp);
        },
        handlePieData:function(){// 饼图数据排行
            var consumePie = [];
            var salePie = [];
            var len = this.oppie.consume.length;
            for(var i=0;i<len;i++){
                consumePie.push({value:this.oppie.consume[i],name:this.oppie.name[i]});
                salePie.push({value:this.oppie.sales[i],name:this.oppie.name[i]});
            }

            var sortConsume = _.sortBy(consumePie,'value');
            var sortSale = _.sortBy(salePie,'value');

            var cd = [];
            var sd = [];
            var sumConsume = 0;
            var saleConsume = 0;

            for(var i = len-1; i >= 0 ; i--){
                if(cd.length<7){
                    cd.push(sortConsume[i]);
                    sd.push(sortSale[i]);
                }else{
                    sumConsume += sortConsume[i].value;

                    saleConsume += sortSale[i].value;
                }
            }
            cd.push({name:'其他',value:sumConsume});
            sd.push({name:'其他',value:saleConsume});
            return {
                consume:cd,
                sale:sd
            }
        },
        setPieOption:function(obj){
            var option = {
                title : {
                    text: obj.title.text
                },
                tooltip : {
                    trigger: 'item', 
                    formatter: "{a} : ({d}%)<br/>金额 : {c} <br/>{b}"
                },
                legend: {
                    orient : 'vertical',
                    x : 'left',
                    data:obj.legend.data
                },
                calculable : true,
                series : [
                    {
                        name:obj.series.name,
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:obj.series.data
                    }
                ]
            };
            return option;
        },
        tapli:function(e){
            var el = e.currentTarget;
            var index = $(el).index();
            if(index !=0){

            }
        },
        changeChart:function(info,xAxis,data1,data2){

            tmpl.basebar_h.title  = {text: info.title};
            tmpl.basebar_h.tooltip  = { trigger: 'axis'};
            tmpl.basebar_h.legend = { data:[info.legend1,info.legend2]};

                tmpl.basebar_h.xAxis.length = 0;
                tmpl.basebar_h.series.length = 0;
                tmpl.basebar_h.xAxis.push({
                    type : 'category',
                    data : xAxis
                });             
                tmpl.basebar_h.series.push({
                    name: info.legend1,
                    type: 'bar', 
                    data: data1.data
                });             
                tmpl.basebar_h.series.push({
                    name: info.legend2,
                    type: 'bar', 
                    data: data2.data
                });             
                this.mychart.clear();
                this.mychart.setOption(tmpl.basebar_h);
        },
        handlerResult:function(data,status,me,dest){
            if(data.retMsg === "success"){
                if(data.data){
                    
                    if(dest === 'bar'){
                            var op = {
                            pNumber:[],
                            id:[],
                            sales:[],
                            name:[],
                            date:[],
                            projectNumber:[],
                            cNumber:[],
                            sellnumber:[],
                            consume:[]
                        }
                        var index = 0;
                        _.map(data.data,function(i){
                                op.pNumber.push(i.pNumber); // 人头
                                op.id.push(i.id);
                                op.sales.push(i.sales-0);
                                op.name.push(i.name);
                                op.date.push(i.date);
                                op.projectNumber.push(i.projectNumber-0);
                                op.cNumber.push(i.cNumber); // 人次
                                op.sellnumber.push(i.sellnumber-0);
                                op.consume.push(i.consume-0);
                        });
                        me.option = op;
                        
                        me.render(data,'bar');
                    }
                    else if(dest === 'pie'){
                        var op2 = {};
                        op2.id = [];
                        op2.name = [];
                        op2.sales = [];
                        op2.consume = [];
                        op2.sellNumber = [];
                        op2.doNumber = [];

                        _.map(data.data,function(i){
                            op2.id.push(i.id);
                            op2.name.push(i.name);
                            op2.sales.push(i.sales-0);
                            // op2.doNumber.push(i.doNumber);
                            // op2.sellNumber.push(i.sellNumber);
                            op2.consume.push(i.consumes-0);
                    });
                        me.oppie = op2;
                        me.render(data,'pie');
                    }else if(dest == 'drawback' ){
                        this.drawbackdata = data;
                        me.render(data,'drawback');
                    }else if(dest == 'refound'){
                        this.drawbackdata = data;
                        me.render(data,'refound');
                    }else if(dest == 'debt'){
                        this.debtdata = data;
                        me.render(data,'debt');
                    }
                    
                }

            }else{
                this.log("加载失败");
            }
        },
        toggle:function(lis,target,classname){
            
            // console.log(target)
            // 设置当前的激活状态
            var index = 0;
            for(var len = lis.length-1;len>=0;len--){
                // console.log()
                if( target === lis[len]){
                    $(lis[len]).addClass(classname);
                    index = len;
                }else{
                    $(lis[len]).removeClass(classname);
                }
            }
            return index;
        },
        selectRefoundTimeType:function(e){
           var target = e.currentTarget;
            var lis = $(".refound");
            var index = this.timeHandle(target,lis,'active');
            this.drawbackTime  = index;
            var me = this;
            this.loadData(function(data,status){
                me.handlerResult(data,status,me,'refound');
            },'refound');
        },
        selectPieTimeType:function(e){
            var target = e.currentTarget;
            var lis = $(".pietime");
            this.timeHandle(target,lis,'active');
            var me = this;
            this.loadData(function(data,status){
                me.handlerResult(data,status,me,'pie');
            },'pie');
        },
        selectBarTimeType:function(e){
            var lis = $(".bartime");
            var target = e.currentTarget;
            this.barTimeType = this.timeHandle(target,lis,'active');
            var me = this;
            this.loadData(function(data,status){
                me.handlerResult(data,status,me,'bar');
            },'bar');
        },
        timeHandle:function(target,lis,classname){
            var _index = $(target).attr("data-time");
            var index;
            for(var len = lis.length-1;len>=0;len--){
                // console.log()
                var temp = $(lis[len]).attr("data-time");
                if( _index == temp){
                    $(lis[len]).addClass(classname);
                    index = temp;
                }else{
                    $(lis[len]).removeClass(classname);
                }
            }
            this.queryPara.dateType = index;
            return index;
        },
        selectSaleType:function(e){
            var target = e.currentTarget;
            var lis = $(".tap-icon1 ul li");
            var classname = 'active';
            var index = this.toggle(lis,target,classname);
            this.queryPara.saleType = index;
            this.barNavType = index;
            var me = this;
            if(!this.option){
                this.loadData(function(data,status){
                    me.handlerResult(data,status,me);
                });
            }
            switch(index){
                case 0:{
                    var base = {title:'销售消耗情况',legend1:'销售',legend2:'消耗'}
                    this.changeChart(base,
                        this.option.date,
                        {
                            name:"销售",
                            data:this.option.sales
                        },
                        {
                            name:'消耗',
                            data:this.option.consume
                        }
                    );
                    break;
                }               
                case 1:{
                    var base = {title:'销售消耗项目量情况',legend1:'销售项目量',legend2:'消耗项目量'}
                    this.changeChart(base,
                        this.option.date,
                        {
                            name:"销售项目量",
                            data:this.option.sellnumber
                        },
                        {
                            name:'消耗项目量',
                            data:this.option.projectNumber
                        }
                    );
                    break;
                }               
                case 2:{
                    var base = {title:'客户情况',legend1:'人头',legend2:'人次'}
                    this.changeChart(
                        base,
                        this.option.date,
                        {
                            name:"人头",
                            data:this.option.pNumber
                        },
                        {
                            name:'人次',
                            data:this.option.cNumber
                        }
                    );
                    break;
                }
            }

        },
        moreInfo:function(){
            
        },
        log:function(o){
            console.log(o);
        },
        seriaUrlPara:function(e){
            if(!$(e.target).attr('showtime') == 'true'){
                return false;
            }
            var key = ['dateType','start','end','storeId'], // 需要的url参数
            dateType = 4, // 时间类型
            start = $('.start').val(), // 开始时间
            end = $('.end').val(); // 结束时间
            var path = new PathMap(),
            map = path.paraMap(window.location.href) ;
            storeId = (map.storeId == '' ? '' : map.storeId);
            value = [dateType,start,end,storeId], // 参数值列表
            para = path.serialPara(key,value); // 序列化参数
            return para;
        },
        queryBody: function(dateType, date, storeId) {
            var data = {
                "device": "11111",
                "sessionId": "",
                "account": "admin",
                "version": "1.0.0",
                "data": {
                    "dateType": dateType,
                    "date": date,
                    "start": "",
                    "end": "",
                    "storeId": storeId,
                }
            }
            return JSON.stringify(data);
        },
        loadData:function(callback,ty,e){
            var params = {
                dateType:this.queryPara.dateType,
                date:(this.formatDate(this.queryPara.dateType-1)),
                storeId:this.queryPara.storeId
            }
            var init_text = JSON.stringify(this.queryPara);
            var params_text = JSON.stringify(params);
            if(init_text == params_text){
                // return;
            }else{
                this.queryPara = params;
            }
            var u;
            var paras = e ? this.seriaUrlPara(e) : "?"+$.param(params);
            var body;
            if(ty == 'bar'){
                
                // u = (this.url.uri+this.url.barApi)+paras;
                u = (this.url.uri+this.url.barApi);
                body = this.queryBody(params.dateType,params.date,params.storeId);
            }
            else if(ty == 'pie'){
                // u = (this.url.uri+this.url.pieApi)+paras;
                u = (this.url.uri+this.url.pieApi);
                body = this.queryBody(params.dateType,params.date,params.storeId);
            }else if(ty == 'drawback'){
                // u = (this.url.uri+this.url.refundApi)+paras;
                u = (this.url.uri+this.url.refundApi);
                body = this.queryBody(params.dateType,params.date,params.storeId);
            }else if(ty == 'refound'){
                params.dateType = this.drawbackTime;
                params.date = (this.formatDate(params.dateType-1));

                // u = (this.url.uri+this.url.refundApi)+paras;
                u = (this.url.uri+this.url.refundApi);
                body = this.queryBody(params.dateType,params.date,params.storeId);
            }else if(ty == 'debt'){
                params.dateType = 0;
                delete params.date;
                // u = (this.url.uri+this.url.staDebtApi)+paras;
                u = (this.url.uri+this.url.staDebtApi);
                body = this.queryBody(params.dateType,params.date,params.storeId);
            }

            this.log(u);
            params = null; 
            $.ajax({
                url:u,
                timeout:4000,
                data:body,
                beforeSend:function(){
                },
                contentType: 'application/json',
                dataType: 'json',
                type: 'post',
                error:function(){
                    console.error('请求错误..' + u);
                },
                success:callback
            });
        },
        formatDate:function(index){// 格式化日期
             var d = new Date();
                    var f ;
                    var mon = d.getMonth()+1;
                    var day = d.getDate();
                    switch(index){

                        case 0:{
                            f = d.getFullYear()+"-"
                            +(mon>9 ? mon : '0'+mon)+"-"
                            +(day>9 ? day : '0'+day);
                            break;
                        }               

                       case 1:{
                            f = d.getFullYear()+"-"+(mon>9 ? mon : '0'+mon);
                            break;
                        }               


                        case 2:{
                            f = d.getFullYear();
                            break;
                        }
                    }
                    // this.log(f);
                    this.selectDate = f;
                    return f;
        }
    });
    


    var pname = 'charts';
    var path = new PathMap();
    var uri = path.getUri(pname);
    var barApi = "api/doSta/staStoreDetail";
    var pieApi = 'api/doSta/staProducts';
    var refundApi = 'api/doSta/staRefundList';
    var staDebtApi = 'api/doSta/staDebtList';
    // var storeId = '9223372036839011934';
    // http://192.168.10.120:8088/xzdxuchang/rest/sta/staStoreDetail?date=2015-07&dateType=2&storeId=9223372036839011934 

    var storeId;

    var events ;
    if(!navigator.userAgent.match(/iPhone|iPod|iPad|Android|ios/i)){
        events = {
              'click  .pietime':'selectPieTimeType',
            'click  .bartime':'selectBarTimeType',
            'click  .refound':'selectRefoundTimeType',
            'click .tap-icon1 ul li':'selectSaleType',
            'click .show':'moreInfo',
            'click .item':'tapli'
        }
    }else{
        events = {
             'touchstart  .pietime':'selectPieTimeType',
            'touchstart  .bartime':'selectBarTimeType',
            'click  .refound':'selectRefoundTimeType',
            'touchstart .tap-icon1 ul li':'selectSaleType',
            'touchstart .show':'moreInfo',
            'touchstart .item':'tapli'
        }
    }
    
    var par = path.paraMap(window.location.href);
    if(path.isContainParas("storeId",par)){
        storeId = path.getValue('storeId',par);
        var app = new V({
            url:{uri:uri,barApi:barApi,pieApi:pieApi,refundApi:refundApi,staDebtApi:staDebtApi},
            queryPara:{dateType:2,storeId:storeId,date:''},
            saleType:0,
            isLoadedinfo:false,
            option:{},
            echarts:echarts,
            mychart:{},
            oppie:null,
            piechart:{},
            events:events
        });
    }else{
        var app = new V({
            url:{uri:uri,barApi:barApi,pieApi:pieApi,refundApi:refundApi,staDebtApi:staDebtApi},
            queryPara:{dateType:2,date:''},
            saleType:0,
            isLoadedinfo:false,
            option:{},
            echarts:echarts,
            mychart:{},
            oppie:null,
            piechart:{},
            events:events
        });
    }
});