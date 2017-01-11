define(function(){
	var option = {
		/*
		// backgroundColor:{},// 背景颜色 默认无 透明
		// color:{},// 数值系列的颜色列表
		calculable : true, // 是否启用拖拽重计算特性，默认关闭
		animation:true, // 是否开启动画，默认开启
		// timeline:{},// 时间轴 , 每个图标只有一个时间轴空间
		title : { },// 标题 可以进行配置
	    toolbox:{},//工具箱 每个图表最多仅有一个工具箱
	    tooltip : {trigger: 'axis'},// 提示框 鼠标悬浮交互时的信息提示
	    legend: {},//图例
	    // dataRange:{},//值域选择
	    // grid:{},//直角坐标系内绘图网格
	    xAxis : [], // 直角坐标系中横轴数组
	    yAxis : [{
            type : 'value'
        }], // 直角坐标系中纵轴数组
        */
	};
	
	option.baseline = {
		tooltip : {},
	    legend: {},
	    calculable : true,
	    xAxis : [],
	    yAxis : [],
	    series : []
	};	
	option.basepie = {
		title:{},
		tooltip : {},
	    legend: {},
	    calculable : true,
	    series : []
	};	
	option.basebar_h = {// 垂直方向的柱形图
		title:{},
		tooltip : {},
	    legend: {},
	    calculable : true,
	    xAxis:[],
	    yAxis:{type : 'value'},
	    series : []
	};

	return option;
});