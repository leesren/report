          (function(w){


          //返回角度
          function GetSlideAngle(dx, dy) {
              return Math.atan2(dy, dx) * 180 / Math.PI;
          }
 
          //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
          function GetSlideDirection(startX, startY, endX, endY) {
              var dy = startY - endY;
              var dx = endX - startX;
              var result = 0;
 
              //如果滑动距离太短
              if(Math.abs(dx) < 2 && Math.abs(dy) < 2) {
                  return result;
              }
 
              var angle = GetSlideAngle(dx, dy);
              if(angle >= -45 && angle < 45) {
                  result = 4;
              }else if (angle >= 45 && angle < 135) {
                  result = 1;
              }else if (angle >= -135 && angle < -45) {
                  result = 2;
              }
              else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
                  result = 3;
              }
 
              return result;
          }
 
          //滑动处理
          var startX, startY;
          var direction = 'right';
           $('body').on('touchstart','.content-body',function (ev) {
              var origEvent = ev.originalEvent;
              // console.log(ev);
              startX = origEvent ? origEvent.touches[0].screenX : ev.screenX ;
              startY = origEvent ? origEvent.touches[0].screenY : ev.screenY;  
          });

          $('body').on('touchend','.content-body',function (ev) {
              var endX, endY;
              var origEvent = ev.originalEvent;
              // console.log(ev);
              endX = origEvent.changedTouches[0].screenX ? origEvent.changedTouches[0].screenX : ev.screenX ;
              endY = origEvent.changedTouches[0].screenY ? origEvent.changedTouches[0].screenY : ev.screenY;  
              var direction = GetSlideDirection(startX, startY, endX, endY);
              switch(direction) {
                  case 0:
                      // console.log("没滑动");
                      break;
                  case 1:
                      // console.log("向上");
                      direction = 'up';
                      break;
                  case 2:
                      direction = 'down';
                      // console.log("向下");
                      break;
                  case 3:
                      // console.log("向左");
                      direction = 'left';
                      break;
                  case 4:
                      direction = 'right';
                      // console.log("向右");
                      break;
                  default:           
              }
              window.direction = direction;
              if(window.direction == 'left' || window.direction == 'right'){
                    $('.left-header').css('overflow','hidden');
                     $('.top-header').css('overflow','auto');
            }else if(window.direction == 'up' || window.direction == 'down'){
                    $('.top-header').css('overflow','hidden');
                    $('.left-header').css('overflow','auto');
            }
          });
})(window);