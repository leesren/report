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
    if ( !(ua.indexOf('ipad')>0 || ua.indexOf('iphone')>0 || ua.indexOf('android') >0) ) {
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
            var id= null;
            switch (tpl) {
                case 'reportStore':
                    type = 1;
                    break;
                case 'reportCustomer':
                	if(map.id!=null){
                		id = map.id.split('#')[0];
            		}
                    type = 2;
                    break;
                case 'reportEmp':
                    type = 3;
                    break;
                case 'reportCategory':
                    type = 4;
                    break;
                case 'reportProduct':
                    type = 5;
                    break;
                case 'reportTotalDebt':
                    type = 6;
                    break;
                case 'reportCard':
                    type = 7;
                    break;
                case 'reportCustomerCard':
                    type = 8;
                    break;
                case 'reportCustomerCardDetail':
                    type = 9;
                    break;
                case 'reportMarketDetail':
                    type = 10;
                    break;
                case 'reportWorkDetail':
                    type = 11;
                    break;
                case 'reportEmpSaleDetail':
                    type = 12;
                    break;
				case 'reportEmpComDetail':
					type = 13;
					break;
				case 'reportArrearDetail':
					type = 14;
					break;
				case 'areaReportEvalute':
					type = 15;
					break;
				case 'reportRcommission':
					type = 16;
					break;
				case 'reportCustomerArrive':
					type = 17;
					break;
				case 'reportCustomerSource':
					type = 18;
					break;
				
				case 'reportStoreCoupons':
					type = 19;
					break;
                case 'reportStoreCouponsDetail':
                	id = map.couponId.split('#')[0];
                    type = 20;
                    break;
				case 'reportTakeGoods':
					type = 21;
					break;
                case 'reportTakeGoodsDetail':
                	id = map.productId;
                    type = 22;
                    break;
                case 'areaReportBusiness':
                    type = 23;
                    break;       
                case 'areaReportCategory':
                	if(map.id!=null){
                		id = map.id.split('#')[0];
                	}
                    type = 24;
                    break;
                case 'areaReportProduct':
                	if(map.id!=null){
                		id = map.id.split('#')[0];
                	}
                    type = 25;
                    break;
                case 'areaReportCard':
                    type = 26;
                    break;
				case 'reportBrandCoupons':
					type = 27;
					break;
					
				case 'ReportBrandPickUpManage':
					type = 28;
					break;
				case 'reportRefund':
					type = 29;
					break;
				case 'reportAreaRefund':
					type =30;
					break;
					
				case 'reportCardDetail':
					type =31;
					break;
					
                case 'reportNextCategory':
                	id = map.id.split('#')[0];
                    type = 32;
                    break;
                default:
                    type = 0;
                    break;
            }
            var isFirst = '1';
            if(map.isFirst!=undefined){
            	isFirst = (map.isFirst.slice(0,1) === "0" ? '0' : '1');
            }
            var reportDto = {
                'storeId': (map.storeId === undefined ? '' : map.storeId),
                'brandId': (map.brandId === undefined ? '' : map.brandId),
                'empId': (map.empId === undefined ? '' : map.empId),
                'start': start,
                'end': end,
                'keyWord': searchKey,
                'customerId': (map.customerId === undefined ? '' : map.customerId),
                'type':(map.type === undefined ? '' : map.type),
                'orgId':(map.organizationId === undefined ? '' : map.organizationId),
                'eValue':(map.eValue === undefined ? '' : map.eValue),
                "isFirst":isFirst,
                "cosmeticsOnly":(map.cosmeticsOnly === undefined ? '' : map.cosmeticsOnly),
                "id":id,
                "organizationId":(map.organizationId== undefined ? '' : map.organizationId),
                "productId":(map.productId== undefined ? '' : map.productId),
                "bcOnlly":(map.bcOnlly== undefined ? '' : map.bcOnlly),
                "name":(map.name== undefined ? '' : map.name.split('#')[0])
            }

            var data = {
                'type': type,
                'reportDto': reportDto
            }

            createForm(uri + 'export_excel.do', data);

        })
    }
});


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

