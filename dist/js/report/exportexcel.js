$(function () {
    var bindexport = false;
    var params = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    var ua = window.navigator.userAgent.toLowerCase();

    for (var i = 0; i < params.length; i++) {
        if ("endstore" == params[i].split('=')[0]) {
            bindexport = true;
            break;
        }
    }
    if (!(ua.indexOf('ipad') > 0 || ua.indexOf('iphone') > 0 || ua.indexOf('android') > 0)) {
        $("#exportexcel").css("display", "block");
        $("#exportexcel").bind("click", function () {
            var path = new Path();
            var uri = path.getUri('charts');
            var map = path.paraMap(window.location.href);
            var start = $('.startTime').val();
            var end = $('.endTime').val();
            var searchKey = $('.searchKey').val();
            var tpl = map.tpl.split('#')[0];
            var type = 1;
            var id = null;
            var filename;
            switch (tpl) {
                case 'reportStore':
                    type = 1;
                    filename = '营业报表';
                    break;
                case 'reportCustomer':
                    if (map.id != null) {
                        id = map.id.split('#')[0];
                    }
                    type = 2;
                    filename = '客户报表';
                    break;
                case 'reportEmp':
                    type = 3;
                    filename = '员工报表';
                    break;
                case 'reportCategory':
                    type = 4;
                    filename = '分类汇总';
                    break;
                case 'reportProduct':
                    type = 5;
                    filename = '产品汇总';
                    break;
                case 'reportTotalDebt':
                    type = 6;
                    filename = '客户负债报表';
                    break;
                case 'reportCard':
                    type = 7;
                    filename = '卡项负债'
                    break;
                case 'reportCustomerCard':
                    type = 8;
                    filename = '客户卡项负债明细报表';
                    break;
                case 'reportCustomerCardDetail':
                    type = 9;
                    filename = '客户卡项负债明细报表-详情';
                    break;
                case 'reportMarketDetail':
                    type = 10;
                    filename = '销售明细汇总';
                    break;
                case 'reportWorkDetail':
                    type = 11;
                    filename = '消耗明细汇总';
                    break;
                case 'reportEmpSaleDetail':
                    type = 12;
                    filename = '员工销售业绩详情';
                    break;
                case 'reportEmpComDetail':
                    type = 13;
                    filename = '员工消耗业绩详情';
                    break;
                case 'reportArrearDetail':
                    type = 14;
                    filename = '欠款报表';
                    break;
                case 'areaReportEvalute':
                    type = 15;
                    filename = '星级评分';
                    break;
                case 'reportRcommission':
                    filename = '阶梯业绩提成';
                    type = 16;
                    break;
                case 'reportCustomerArrive':
                    filename = '客户到店排行';
                    type = 17;
                    break;
                case 'reportCustomerSource':
                    type = 18;
                    filename = '新客来源统计';
                    break;
                case 'reportStoreCoupons':
                    type = 19;
                    filename = '门店体验券';
                    break;
                case 'reportStoreCouponsDetail':
                    filename = '门店体验券详情';
                    id = map.couponId.split('#')[0];
                    type = 20;
                    break;
                case 'reportTakeGoods':
                    type = 21;
                    filename = '产品取货报表';
                    break;
                case 'reportTakeGoodsDetail':
                    id = map.productId;
                    filename = '产品取货详情报表';
                    type = 22;
                    break;
                case 'areaReportBusiness':
                    type = 23;
                    filename = '营业报表';
                    break;
                case 'areaReportCategory':
                    if (map.id != null) {
                        id = map.id.split('#')[0];
                    }
                    type = 24;
                    filename = '分类汇总';
                    break;
                case 'areaReportProduct':
                    if (map.id != null) {
                        id = map.id.split('#')[0];
                    }
                    filename = '产品汇总';
                    type = 25;
                    break;
                case 'areaReportCard':
                    type = 26;
                    filename = '卡项负债';
                    break;
                case 'reportBrandCoupons':
                    type = 27;
                    filename = '体验券报表';
                    break;

                case 'ReportBrandPickUpManage':
                    type = 28;
                    break;
                case 'reportRefund':
                    type = 29;
                    filename = '退款报表';
                    break;
                case 'reportAreaRefund':
                    type = 30;
                    filename = '退款汇总报表'
                    break;

                case 'reportCardDetail':
                    type = 31;
                    filename = '卡项负债明细';
                    break;

                case 'reportNextCategory':
                    id = map.id.split('#')[0];
                    type = 32;
                    filename = '分类汇总层级';
                    break;
                case 'customerTransOrdersReport':
                    type = 33;
                    filename = '客户临时转店消费记录';
                    break;
                case 'reportStoreCouponsConsumeDetail':
                    type = 34;
                    if (map.organizationId === undefined) {
                        map.organizationId = map.storeId;
                    }
                    filename = '门店体验券消耗详情';
                    break;
                default:
                    type = 0;
                    break;
            }
            var isFirst = '1';
            if (map.isFirst != undefined) {
                isFirst = (map.isFirst.slice(0, 1) === "0" ? '0' : '1');
            }
            var reportDto = {
                'storeId': (map.storeId === undefined ? '' : map.storeId),
                'brandId': (map.brandId === undefined ? '' : map.brandId),
                'empId': (map.empId === undefined ? '' : map.empId),
                'start': start,
                'end': end,
                'keyWord': searchKey,
                'customerId': (map.customerId === undefined ? '' : map.customerId),
                'type': (map.type === undefined ? '' : map.type),
                'orgId': (map.organizationId === undefined ? '' : map.organizationId),
                'eValue': (map.eValue === undefined ? '' : map.eValue),
                "isFirst": isFirst,
                "cosmeticsOnly": (map.cosmeticsOnly === undefined ? '' : map.cosmeticsOnly),
                "id": id,
                "organizationId": (map.organizationId == undefined ? '' : map.organizationId),
                "productId": (map.productId == undefined ? '' : map.productId),
                "bcOnlly": (map.bcOnlly == undefined ? '' : map.bcOnlly),
                "name": (map.name == undefined ? '' : map.name.split('#')[0])
            }

            var data = {
                'type': type,
                'reportDto': reportDto
            }
            var priod = eher_util.getDateTime($('.endTime').val()) - eher_util.getDateTime($('.startTime').val());
            var day_time = 1 * 24 * 60 * 60 * 1000;
            if( (priod / day_time)  > 93 ){
                alert('您导出的报表时间范围超过了3个月！');
                return;
            }

            if (filename) {
                window.excle = true;
                var url = uri + 'export_excel.do';
                if (window.isExport) return;
                window.isExport = true;
                $('#exportexcel').attr('disabled', true).css('opacity', 0.4).text('处理中...');
                loadData(url, data, function (result) {

                    window.isExport = false;
                    if (!window.XLSX) {
                        window.excle = false;
                        return;
                    }
                    eher_util.write_excle(result.data, '#' + tpl + '-tpl', filename);
                    window.excle = false;
                    $('#exportexcel').attr('disabled', false).css('opacity', 1).text('导出EXCEL');
                }, function (error) {
                    alert('导出失败，请重试');
                    window.excle = false;
                    window.isExport = false;
                    $('#exportexcel').attr('disabled', false).css('opacity', 1).text('导出EXCEL');
                })
            }
            else {
                createForm(uri + 'export_excel.do', data);
            }
        })
    }
});

function loadData(url, data, callback, error) {
    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (res) {
            if (typeof callback === 'function')
                callback(res);
        },
        error: function (e) {
            if (typeof error === 'function')
                error(e)
        },
    });
}

function createForm(url, data) {
    var form = $("<form>");
    form.attr('style', 'display:none');
    form.attr('target', '');
    form.attr('method', 'post');
    form.attr('action', url);

    var input4 = $('<input>');
    var start = $('.startTime').val();
    var end = $('.endTime').val();


    var jsonData = JSON.stringify(data);

    input4.attr('type', 'hidden');
    input4.attr('name', 'content');
    input4.attr('value', jsonData);

    $('body').append(form);
    form.append(input4);
    form.submit();
    form.remove();
    return false;
}
function eher_util() { }
eher_util.prototype.getDateTime = function (str) {
    if(!str) return Date.now();
    var a = str.split('-');
    if(!a.length) return Date.now();
    var d = new Date();
    d.setFullYear(a[0]);
    d.setMonth(a[1] - 1);
    d.setDate(a[2])
    return d.getTime()
}
eher_util.prototype.s2ab = function s2ab(s) {
    if (typeof ArrayBuffer !== 'undefined') {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    } else {
        var buf = new Array(s.length);
        for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
}
eher_util.prototype.write_excle = function (out_list, tpl_id, filename) {
    // console.log('daochu');

    var template = _.template($(tpl_id).html());
    var html = template({ data: out_list, excle: true });
    // console.log(html);
    var div = document.createElement('div');
    div.innerHTML = html;
    var table_excel = div.querySelector('table');
    var self = this;
    function down(dom) {
        var type = 'xlsx';
        var wb = XLSX.utils.table_to_book(dom, { sheet: "Sheet JS" });
        var wbout = XLSX.write(wb, { bookType: type, bookSST: true, type: 'binary' });
        var fname = (filename || 'data') + '.' + type;
        try {
            saveAs(new Blob([self.s2ab(wbout)], { type: "application/octet-stream" }), fname);
        } catch (e) { if (typeof console != 'undefined') console.log(e, wbout); }
    }

    down(table_excel);
}
window.eher_util = new eher_util();