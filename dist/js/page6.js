(function($){
            var timepick = function(){

            };
            timepick.initpicker = function(){
                    $.fn.datepicker.dates["zh-CN"]= {
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
            };
            timepick.selecttime = function(){
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
            };
             timepick.initTimevalue = function(){
                var endtime = this.formatDate(0);
                var starttime = this.getPreMonth(endtime);
                $('.end').attr('value',endtime);
                $('.start').attr('value',endtime);
            };
             timepick.formatDate = function(index){// 格式化日期
                var d = new Date(),
                    f ,
                    mon = d.getMonth()+1,
                    day = d.getDate();
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
        };
         timepick.getPreMonth = function(date) { 
                    var arr = date.split('-'),  
                    year = arr[0], //获取当前日期的年份  
                    month = arr[1], //获取当前日期的月份  
                    day = arr[2], //获取当前日期的日  
                    days = new Date(year, month, 0),  
                    days = days.getDate(), //获取当前日期中月的天数  
                    year2 = year, 
                    month2 = parseInt(month) - 1;
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
            } ;
            
            timepick.initpicker(); 
            timepick.selecttime(); 
            timepick.initTimevalue();
            window.timepick = timepick;
})($);