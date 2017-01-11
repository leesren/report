//解析URL并转换为json形式
function _parserUrl(tourl) {
    if (!tourl)
        return null;

    if(tourl.split('?').length < 2)
        return null;

    var paramsArr = tourl.split('?')[1].split('&');
    var args = {}, argsStr = [], param, name, value;
    args['url'] = encodeURIComponent(tourl.split('?')[0]); //首先载入url,问号"?"前面的部分
    for (var i = 0; i < paramsArr.length; i++) {
        param = paramsArr[i].split('=');
        name = param[0], value = param[1];
        if (name == "")name = "unkown";
        if (typeof args[name] == "undefined") { //参数尚不存在
            args[name] = value;
        } else if (typeof args[name] == "string") { //参数已经存在则保存为数组
            args[name] = [args[name]];
            args[name].push(value);
        } else { //已经是数组的
            args[name].push(value);
        }
    }

    var showArg = function (x) {   //转换不同数据的显示方式
        if (typeof(x) == "string" && !/\d+/.test(x)) return "'" + x + "'";   //字符串
        if (x instanceof Array) return "[" + x + "]"; //数组
        return x;   //数字
    };
    args.toString = function () {//组装成json格式
        for (var i in args) argsStr.push(i + ':' + showArg(args[i]));
        return '{' + argsStr.join(',') + '}';
    };
    return args; //以json格式返回获取的所有参数
}

function getDate (dateType) {
    var str;

    var date = new Date();

    var year = date.getFullYear(), month = (date.getMonth() + 1) + "", day = date.getDate() + "";

    if(month.length < 2) {
        month = "0" + month;
    }

    if(day.length < 2)
        day = "0" + day;

    if(dateType == "1") {
        str = year + "-" + month + "-" + day;
    } else if(dateType == "2") {
        str = year + "-" + month;
    } else
        str = year;

    return str;
}

function dateFormat(date) {
    var month = (date.getMonth() + 1) + "", day = date.getDate() + "";
    if(month.length < 2) {
        month = "0" + month;
    }

    if(day.length < 2)
        day = "0" + day;

    return date.getFullYear() + "-" + month + "-" + day;
}