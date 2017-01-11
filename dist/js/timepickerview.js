var TimeView = Backbone.View.extend({
        
        initialize:function(args){
            this.mainView = args.mainView;
            this.initTimeForm('day');
            this.initTimevalue();
            this.selectTimeComponet('day');
            this.path = args.path;
        },
        events:{
            'change .start':'blurtime',
            'change .end':'blurtime',
            'touchstart .searbyTime':'searbyTime'
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
        setTimeboxPositon:function(e){
                    var gap = 10;
                    var $el  = $(e.target);
                    var x = e.target.offsetLeft-$('.smalldatePick').width()-gap;
                    var y = e.target.offsetTop;
                    $(e.target).text('查询').addClass('time-active').attr('showtime','true');
                    $('.smalldatePick').css({'top':y+'px','left':x+'px','opacity':1});
        },
        searbyTime:function(e){
            if(!$(e.target).hasClass('active')){
                this.selectTimeComponet('day');
                this.setTimeboxPositon(e);
                this.blurtime();
                $(e.target).attr('showtime','true');
            }else{
                this.mainView.selectRefoundTimeType(e);
            }
            // this.loadData({url:url},function(e){me.mainView.render(e)});
        },
        initTimeForm:function(){
             !function(a) {
                a.fn.datepicker.dates["zh-CN"]= {
                days:["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
                daysShort:["周日","周一","周二","周三","周四","周五","周六"],
                daysMin:["日","一","二","三","四","五","六"],
                months:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
                monthsShort:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
                today:"今日",
                clear:"清除",
                format:"yyyy-mm-dd",
                titleFormat:"yyyy-mm",
                weekStart:1
                }
            }($);
        },
        selectTimeComponet:function(type){
            $('.start').datepicker(this.timeComponetSetting(type));             
            $('.end').datepicker(this.timeComponetSetting(type)); 
        },
        timeComponetSetting:function(type){
            var daytime = {
                           todayBtn: "linked",
                            clearBtn: false,
                            language: "zh-CN",
                            orientation: "top left",
                            keyboardNavigation: false,
                            autoclose: true,
                            todayHighlight: false
            }
            var monthtime = {
                    format: "yyyy-mm",
                    startView: 1,
                    minViewMode: 1,
                    clearBtn: false,
                    language: "zh-CN",
                    autoclose: true
            }
            return  type =='day' ? daytime : monthtime;
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
    var TimeView = new TimeView({el:'body',mainView:app,path:path});