var Path = (function(window){
	var UrlOp = function(){};
	UrlOp.prototype.paraMap = function(url){
		var searchUrl;
		if(url && url.length>0){
			searchUrl =  url.substring(url.indexOf("?"),url.length)
		}else{
			// 获取URL后面的查询参数
			searchUrl = window.location.search;
		}
		// 去掉？号
		var queryParam = searchUrl.substring(1,searchUrl.length);
		//获取每一个键值对
		var parameters =  queryParam.split("&");
		// 键值对映射
		var paraMap = {};
		for(var i=0,len = parameters.length;i<len;i++){
			var temp = parameters[i].split("=");
			paraMap[temp[0]] = temp[1];
		}
		return paraMap;
	}
	UrlOp.prototype.isContainParas = function(key,map){
		if(!map)return false;
		if(key in map)
		{
			return true;
		}
		return false;
	}
	UrlOp.prototype.getValue = function(key,map){
		if(key in map)
		{
			return map[key];
		}
	}
	UrlOp.prototype.getUri = function(project_name){
		return window.location.href.substring(0,window.location.href.indexOf(project_name));
	}
	/*

	序列化参数列表，
	@para keyArray [Array] 字段属性 必须
	@para valueArray [Array] 字段值 非必须
	返回参数化序列 ?a=xx&b=12
	*/
	UrlOp.prototype.serialPara = function(keyArray,valueArray){
		var p = [];
		if(!valueArray){
			valueArray = [];
		}
		if(keyArray instanceof Array && keyArray.length>0){
			for (var i = keyArray.length - 1; i >= 0; i--) {
				temp = keyArray[i]+ '='+(valueArray[i] ==undefined ? '':valueArray[i]) ;
				p.push(temp);
			};
		}
		var text = '?'+p.join('&');
		return text;
	}
	return UrlOp;
})(window);

