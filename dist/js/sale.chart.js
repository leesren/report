define(['backbone','bluetheme','../js/data.template'],function(Backbone,bluetheme,tmpl){

	 tmpl.basebar_h.title  = {text: '业绩销售情况',subtext: '纯属虚构'};
        tmpl.basebar_h.tooltip  = { trigger: 'axis'};
        tmpl.basebar_h.legend = { data:['销售项目量','消耗项目量']};
        tmpl.basebar_h.xAxis.push({
            type : 'category',
            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        });

        tmpl.basebar_h.series.push({
            name:'销售项目量',
            type:'bar',
            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
            
        });
        tmpl.basebar_h.series.push({
            name:'消耗项目量',
            type:'bar',
            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]

        });        
        


        var View = Backbone.View.extend({
         	el:'body',
         	initialize:function(obj){
         		this.chart = obj.chart;
         	},
         	events : {
         		
         	},
         	render:function(op){
         		this.chart.clear();
            	this.loading(op);
         	},
         	show:function(e){
         		
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

		 var myChart = echarts.init(document.getElementById('chart-content'),bluetheme); 
         var v = new View({chart:myChart});
         v.loading(tmpl.basebar_h);
})