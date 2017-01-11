
requirejs.config({
	baseUrl:'dist/lib',
	paths:{
		backbone:'backbone/backbone-min',
		underscore:'underscore/underscore-min',
		jquery:'jquery/jquery.min',
		datePick:'../js/bootstrap-datepicker',
		mobileEvent:'jquery/jquery.mobile-events.min'
	},
	shim:{
		jquery:{
			exports:'$'
		},
		backbone:{
			deps:['underscore','jquery'],
			exports:'Backbone'
		},
		datePick:{
			deps:['jquery']
		},
		mobileEvent:{
			deps:['jquery']
		}

	}
});
	requirejs(['backbone','../js/pathHandle','datePick','mobileEvent'],function(Backbone,PathMap){	
	var V = Backbone.View.extend({
		el:'body',
		template:_.template($("#shoplist-tmpl").html(),{variable: 'data'}),
		initialize:function(obj){
			this.storeId = obj.storeId;
			this.url = obj.url;	
			this.queryPara = obj.queryPara;	
			var me = this;
			this.loadData(function(data,status){
				me.handlerResult(data,status,me);
			});
		},
		handlerResult:function(data,status,me){
			if(data.retMsg === "success"){
				me.render(data);
			}else{
				alert("加载失败");
			}
		},
		events:{
			'click .p4-ranking ul .items':'openDetail',
			'click .time ul .items':'selectDate'
		},
		render:function(res){
			if(!res.data){
				return;
			}
			var me = this;

			var t = setTimeout(function(){
				clearTimeout(t);
				
				if(res.data.length === 0){

					$(".loading").html("<p class='nodata'>"+me.selectDate+"暂时没有数据...</p>");
					
				}else{
					var html = me.template(res);
					$(".p4-ranking ul").html(html);

					var sum = me.count($(".p4-ranking ul .items"));
					$(".sum_sc").text(Number(sum.sum_sc).toFixed(2));
					$(".sum_cc").text(Number(sum.sum_cc).toFixed(2));
				}

			},600);
		},
		openDetail:function(e){
			var target =  $(e.currentTarget);
			var list = $(".p4-ranking ul .items");
			var _index = target.index();
			if(_index  ===  0){
				return ;
			}
			var return_index = this.toggle(list,target,"active",_index);
			var storeId = this.saveDataTolocal(target);
			window.setTimeout(function(){
				window.location.href="page3.html?storeId="+storeId
			},600);
		},
		log:function(o){
			console.log(o);
		},
		saveDataTolocal:function(target){
			var localdata = {};
			var el = $(target).find('a');
			localdata.name = $(el[0]).text();
			localdata.sales= $(el[1]).text();
			localdata.sellnumber= $(el[2]).text();
			localdata.consume= $(el[3]).text();
			localdata.consumeNumber= $(el[4]).text();
			localdata.cNumber= $(el[5]).text();
			localdata.pNumber= $(el[6]).text();

			var text = JSON.stringify(localdata);
			if(window.localStorage.storeInfo){
				window.localStorage.removeItem('storeInfo');
			}
			window.localStorage.storeInfo = text;
			return $(target).attr("data-store"); 
		},
		toggle:function(lis,target,classname,index){
			// console.log(target)
			// 设置当前的激活状态
			var _index = 0;
			for(var len = lis.length-1;len>=0;len--){
				// console.log()
				if( len === index){
					$(lis[len]).addClass(classname);
					_index = len;
				}else{
					$(lis[len]).removeClass(classname);
				}
			}
			return _index;
		},
		count:function(lis){
			var _index = 1;
			var sum_sc = 0;
			var sum_cc = 0;
			for(var len = lis.length-1;len>=1;len--){
				sc = $(lis[len]).find('.scount').text();
				sum_sc += Number(sc);
				cc = $(lis[len]).find('.ccount').text();
				sum_cc += Number(cc);
			}
			return {
				 sum_sc:sum_sc.toFixed( 2 ),
				 sum_cc:sum_cc.toFixed( 2 )
			}
		},
		selectDate:function(e){
			
			var _index = $(e.currentTarget).index();
			if((_index+1) === this.queryPara.dateType ){
				return;
			}
			var list = $(".datePick .time ul .items");
			
			var index = this.toggle(list,{},'active',_index);
			this.queryPara.dateType = index;
			var me = this;
			this.loadData(function(data,status){
				me.handlerResult(data,status,me);
			});
		},
		loadData:function(callback){
			
			var params = {
				dateType:this.queryPara.dateType+1,
				date:(this.formatDate(this.queryPara.dateType))
			}
			var init_text = JSON.stringify(this.queryPara);
			var params_text = JSON.stringify(params);
			if(init_text == params_text){
				return;
			}else{
				this.queryPara = params;
			}
			var u;
			if(!this.storeId){
				u = this.url+"?"+$.param(params);
			}else{
				u = this.url+"?"+$.param(params)+"&storeId="+this.storeId;
			}
			
			// 查询体
			var querybody = {
				"device": "11111",
				"sessionId": "",
				"account": "admin",
				"version": "1.0.0",
				"data": {
					"dateType": params.dateType,
					"date": params.date,
					"storeId": this.storeId,
					"start": "",
					"end": ""
				}
			}


			$.ajax({
				url:this.url,
				timeout:4000,
				data:JSON.stringify(querybody),
				beforeSend:function(){
					$(".p4-ranking ul").html("");
					var temp = _.template($("#loading-tmpl").html(),{variable: 'data'});
					html = temp({});
					$(".p4-ranking ul").html(html);
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
	var par = path.paraMap(window.location.href);
	var api = "api/doSta/staStore";

	var storeId;
	var app;
	var events ;
	if(!navigator.userAgent.match(/iPhone|iPod|iPad|Android|ios/i)){
	    events = {
	          'click .p4-ranking ul .items':'openDetail',
	   	'click .time ul .items':'selectDate'
	    }
	}else{
	    events = {
	         'tap .p4-ranking ul .items':'openDetail',
	  	'tap .time ul .items':'selectDate'
	    }
	}
	if(path.isContainParas("storeId",par)){
		storeId = path.getValue('storeId',par);
		// 实例化视图
		// 实例化视图
		app = new V({
			url:(uri+api),
			storeId:storeId,
			queryPara:{dateType:0,date:0},
			events:events
		});
	}else{
		// 实例化视图
		// 实例化视图
		app = new V({
			url:(uri+api),
			queryPara:{dateType:0,date:0},
			events:events
		});
	}

	var TimeView = Backbone.View.extend({
		
		initialize:function(args){
			this.mainView = args.mainView;
			this.initTimeForm();
			this.initTimevalue();
			this.selectTimeComponet();
			this.path = args.path;
		},
		events:{
			'change .start':'blurtime',
			'change .end':'blurtime',
			'touchstart .searbyTime':'searbyTime',
		},
		render:function(){

		},
		blurtime:function(){
			$('.searbyTime').addClass('active');
		},
		initTimevalue:function(){
			var endtime = this.mainView.formatDate(0);
			var starttime = this.getPreMonth(endtime);
			$('.end').attr('value',endtime);
			$('.start').attr('value',endtime);
		},
		searbyTime:function(e){
			if(!$(e.target).hasClass('active')){
				this.blurtime();
			}
			var uri = this.mainView.url, //url 地址
			key = ['dateType','start','end','storeId'], // 需要的url参数
			dateType = 4, // 时间类型
			start = $('.start').val(), // 开始时间
			end = $('.end').val(), // 结束时间
			storeId = this.mainView.storeId == undefined ? '' : this.mainView.storeId;
			value = [dateType,start,end,storeId], // 参数值列表
			// para = this.path.serialPara(key,value); // 序列化参数
			me = this,
			url = uri;
			// console.log(url);


			// 查询体
			var querybody = {
				"device": "11111",
				"sessionId": "",
				"account": "admin",
				"version": "1.0.0",
				"data": {
					"dateType": dateType,
					"date": start+'to'+end,
					"storeId": storeId,
					"start": start,
					"end": end
				}
			}
			this.loadData({url:url,querybody:querybody},function(e){me.mainView.render(e)});
		},
		initTimeForm:function(){
			 !function(a) {
			    a.fn.datepicker.dates["zh-CN"]= {
			    days:["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],daysShort:["周日","周一","周二","周三","周四","周五","周六"],daysMin:["日","一","二","三","四","五","六"],months:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],monthsShort:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],today:"今日",clear:"清除",format:"yyyy-mm-dd",titleFormat:"yyyy-mm",weekStart:1
				}
			}($);
		},
		selectTimeComponet:function(){
			$('.start').datepicker({
		                 todayBtn: "linked",
		                    clearBtn: false,
		                    language: "zh-CN",
		                    orientation: "top left",
		                    keyboardNavigation: false,
		                    autoclose: true,
		                    todayHighlight: false
		            }).on('hide',function(e){
		            	var $el = $('.start');
				if(!e.date){ 
				  	$el.val($el.attr('value'));
				  	$el.attr('value',$el.val());
				  	return;
				}else{
					$el.attr('value',e.format());
				}
			});             
		            $('.end').datepicker({
		                    todayBtn: "linked",
		                    clearBtn: false,
		                    language: "zh-CN",
		                    orientation: "top left",
		                    keyboardNavigation: false,
		                    autoclose: true,
		                    todayHighlight: false
		            }).on('hide',function(e){
		            	var $el = $('.end');
				if(!e.date){ 
				  	$el.val($el.attr('value'));
				  	$el.attr('value',$el.val());
				  	return;
				}else{
					$el.attr('value',e.format());
				}
			});
		},
		loadData:function (ops,callback) {
			$.ajax({
				url:ops.url,
				data:JSON.stringify(ops.querybody),
				timeout:4000,
				beforeSend:function(){
					$(".p4-ranking ul").html("");
					var temp = _.template($("#loading-tmpl").html(),{variable: 'data'});
					html = temp({});
					$(".p4-ranking ul").html(html);
				},
				contentType: 'application/json',
				dataType: 'json',
				type: 'post',
				error:function(){
					console.error('请求错误..' + u);
				},
				success:callback});
		},
		getPreMonth:function(date) { 
			var arr = date.split('-');  
			var year = arr[0]; //获取当前日期的年份  
			var month = arr[1]; //获取当前日期的月份  
			var day = arr[2]; //获取当前日期的日  
			var days = new Date(year, month, 0);  
			days = days.getDate(); //获取当前日期中月的天数  
			var year2 = year;  
			var month2 = parseInt(month) - 1;  
			if (month2 == 0) {  
				year2 = parseInt(year2) - 1;  
				month2 = 12;  
			}  
			var day2 = day,
			days2 = new Date(year2, month2, 0);  
			days2 = days2.getDate();  
			if (day2 > days2) {  
			    day2 = days2;  
			}  
			if (month2 < 10) {  
			    month2 = '0' + month2;  
			}  
			var t2 = year2 + '-' + month2 + '-' + day2;  
			return t2;  
	        }  
	});
	if(!navigator.userAgent.match(/iPhone|iPod|iPad|Android|ios/i)){
		    events = {
			'change .start':'blurtime',
			'change .end':'blurtime',
			'click .searbyTime':'searbyTime',
		    }
		}else{
		    events = {
			'change .start':'blurtime',
			'change .end':'blurtime',
			'touchstart .searbyTime':'searbyTime',
		    }
		}
	new TimeView({el:'body',mainView:app,path:path,events:events});	
});