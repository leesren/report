define(['backbone','bluetheme','../js/data.template'],function(Backbone,bluetheme,tmpl){
		// 基于准备好的dom，初始化echarts图表

		var temp = tmpl;
		temp.baseline.title = {text: '某站点用户访问来源'};
		temp.baseline.tooltip = {
			trigger: 'axis',
			axisPointer:{type: 'line',
		    lineStyle: {
		        color: '#48b',
		        width: 2,
		        type: 'solid'
		    }}};
		temp.baseline.legend = {data:['最高']};
		temp.baseline.xAxis.push({
            type : 'category',
            boundaryGap : false,
            data : function (){
                var list = [];
                for (var i = 1; i <= 30; i++) {
                    list.push('2013-03-' + i);
                }
                return list;
            }()
        })
		temp.baseline.series.push( 
       {
            name:'最高',
            type:'line',
            smooth:true,
            data:function (){
                var list = [];
                for (var i = 1; i <= 30; i++) {
                    list.push(Math.round(Math.random()* 30));
                }
                return list;
            }()
        });



        tmpl.basepie.title  = {text: '某站点用户访问来源',subtext: '纯属虚构',x:'center'};
        tmpl.basepie.tooltip  = { trigger: 'item',formatter: "{a} <br/>{b} : {c} ({d}%)"};
        tmpl.basepie.legend  = { orient : 'vertical',x : 'left',data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']};
        tmpl.basepie.series.push({
            name:'访问来源',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        });     


        tmpl.basebar_h.title  = {text: '某地区蒸发量和降水量',subtext: '纯属虚构'};
        tmpl.basebar_h.tooltip  = { trigger: 'axis'};
        tmpl.basebar_h.legend = { data:['蒸发量']};
        tmpl.basebar_h.xAxis.push({
            type : 'category',
            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        });

        tmpl.basebar_h.series.push({
            name:'蒸发量',
            type:'bar',
            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            },
            markLine : {
                data : [
                    {type : 'average', name: '平均值'}
                ]
            }
        });
        tmpl.basebar_h.series.push({
            name:'降水量',
            type:'bar',
            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
            markPoint : {
                data : [
                    {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
                    {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
                ]
            },
            markLine : {
                data : [
                    {type : 'average', name : '平均值'}
                ]
            }
        });

         var View = Backbone.View.extend({
         	el:'body',
         	initialize:function(obj){
         		this.chart = obj.chart;
         	},
         	events : {
         		"click .btn":"show"
         	},
         	render:function(op){
         		this.chart.clear();
            	this.loading(op);
         	},
         	show:function(e){
         		var index = $(e.currentTarget).attr("data-index");
         		switch(index){
         			case '1' :{
         				this.render(temp.baseline);
         				break;
         			}         			
         			case '2' :{
         				this.render(temp.basepie);
         				break;
         			}         			
         			case '3' :{
         				this.render(temp.basebar_h);
         				break;
         			}
         			case '4' :{
         				this.newChart(temp.baseline);
         				break;
         			}
         		}
         	},
         	newChart:function(op){
         		var newCharts = echarts.init(document.getElementById('newcharts'),bluetheme);
         		this.chart = newCharts;
         		this.loading(op);
         	},
         	loading:function(op,dom){
	         	this.chart.showLoading({
				    text : "数据加载中...",
				    effect : 'whirling',
				    textStyle : {
				        fontSize : 20
				    }
				});
	         	var chart = this.chart;
				loadingTicket = setTimeout(function (){
				    chart.hideLoading();
				    chart.setOption(op,bluetheme);
				    clearTimeout(loadingTicket);
				},1200);
         	}
         });


		 var myChart = echarts.init(document.getElementById('main'),bluetheme); 
         var v = new View({chart:myChart});
         v.loading(temp.baseline);



});