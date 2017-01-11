'use strict';
(function(window){
     window.loadAndroidCss = function(address,modernizr){
            var userAgent = window.navigator.userAgent.toLowerCase();
            var android = userAgent.match(/applewebkit\/(.*)\(/);
            var version;
            var support = 537.36;
            if(android && userAgent.indexOf('android') !=-1){
                    if(android[1]){
                        version = android[1].trim()*1;
                        if(version >= support){
                                console.log(userAgent+'\nandroid 大于等于' +support+' 版本'+support);
                        }else{
                                // 创建 请求Android适配链接
                                var link = document.createElement('link');
                                var head = document.getElementsByTagName('head')[0];
                                link.setAttribute('rel', 'stylesheet');
                                link.setAttribute('href', address);
                                if(head){
                                    head.appendChild(link);
                                    
                                }
                                if(modernizr){
                                            // 插如modernizr 检测
                                            var script = document.createElement('script');
                                            script.src = modernizr;
                                            head.appendChild(script);
                                }
                                window.lowerAndroidVersion = true;
                                console.warn(userAgent+'\nandroid 小于' +support+' 版本'+support);
                        
                    }
            }
        }
    }
})(window);