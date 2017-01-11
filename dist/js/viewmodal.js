 (function(window){
              var Effect = function(){
                    this.isShow = false;
                    this.$overlay = null;
                    this.overflow = '';
                }
                Effect.prototype.open = function(el,callback){
                                this.overflow = $('body').css('overflow');
                                $('body').css('overflow','hidden');
                                if(this.isShow){
                                    return;
                                }
                                var view = $(el).attr('data-view');
                                var effectIn = $(view).attr('effect-in');
                                this.addOverlay();
                                $(view).show().addClass(effectIn);
                                var me = this;
                                 $(view).on(this.transitionEndEventNames.WebkitTransition,function(e){
                                    me.isShow = true;
                                    $(view).off(me.transitionEndEventNames.WebkitTransition);
                                    if(typeof callback =='function'){
                                         callback();
                                     }
                                });
                                
                };
                 Effect.prototype.close = function(el,callback){
                        $('body').css('overflow',this.overflow);
                        if(!this.isShow){
                            return;
                        }
                        var view = $(el).attr('data-view');
                        var effect_In = $(view).attr('effect-in');
                        var effect_out = $(view).attr('effect-in');
                        $(view).addClass(effect_out).removeClass(effect_out).removeClass(effect_In);
                        var me = this;
                        $(view).on(this.transitionEndEventNames.WebkitTransition,function(e){
                            me.removeOverlay();
                            $('.popup-overlay').hide();
                             me.isShow = false;
                            if(typeof callback =='function'){
                                callback();
                            }
                        });
                 };
                Effect.prototype.addOverlay = function(e) {// 添加弹层
                  if(!this.$overlay){
                    // 设置属性
                    var attr = [];
                    attr.push('class="effeckt-overlay"');// 
                    attr.push('style=');
                    attr.push('height:'+$(document).height()+'px');

                    this.$overlay = $('<div '+attr.join(' ')+'></div>');
                    $('body').append(this.$overlay);

                    this.$overlay.offsetWidth; // 强制reflow
                  }
                  this.$overlay.addClass('effeckt-overlay-visibility');
                };
                Effect.prototype.removeOverlay = function(){
                  if(this.$overlay){  
                     this.$overlay.removeClass('effeckt-overlay-visibility');
                  }
                };

                Effect.prototype.transitionEndEventNames = {
                  'WebkitTransition' : 'webkitTransitionEnd',
                  'OTransition' : 'oTransitionEnd',
                  'msTransition' : 'MSTransitionEnd',
                  'transition' : 'transitionend'
                };
                window.Effect = new  Effect();
})(window);