"use strict";
/*!
 * jQuery Mobile Events
 * by Ben Major (www.ben-major.co.uk)
 *
 * Copyright 2011, Ben Major
 * Licensed under the MIT License:
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
(function(n){function l(){var n=e();n!==s&&(s=n,f.trigger("orientationchange"))}function i(t,i,r,u){var f=r.type;r.type=i;n.event.dispatch.call(t,r,u);r.type=f}var f,g,e,s,h,c,o;n.attrFn=n.attrFn||{};var r=navigator.userAgent.toLowerCase(),u=r.indexOf("chrome")>-1&&(r.indexOf("windows")>-1||r.indexOf("macintosh")>-1||r.indexOf("linux")>-1)&&r.indexOf("mobile")<0&&r.indexOf("android")<0,t={tap_pixel_range:5,swipe_h_threshold:50,swipe_v_threshold:50,taphold_threshold:750,doubletap_int:500,touch_capable:window.navigator.msPointerEnabled?!1:"ontouchstart"in window&&!u,orientation_support:"orientation"in window&&"onorientationchange"in window,startevent:window.navigator.msPointerEnabled?"MSPointerDown":"ontouchstart"in window&&!u?"touchstart":"mousedown",endevent:window.navigator.msPointerEnabled?"MSPointerUp":"ontouchstart"in window&&!u?"touchend":"mouseup",moveevent:window.navigator.msPointerEnabled?"MSPointerMove":"ontouchstart"in window&&!u?"touchmove":"mousemove",tapevent:"ontouchstart"in window&&!u?"tap":"click",scrollevent:"ontouchstart"in window&&!u?"touchmove":"scroll",hold_timer:null,tap_timer:null};if(n.isTouchCapable=function(){return t.touch_capable},n.getStartEvent=function(){return t.startevent},n.getEndEvent=function(){return t.endevent},n.getMoveEvent=function(){return t.moveevent},n.getTapEvent=function(){return t.tapevent},n.getScrollEvent=function(){return t.scrollevent},n.each(["tapstart","tapend","tapmove","tap","tap2","tap3","tap4","singletap","doubletap","taphold","swipe","swipeup","swiperight","swipedown","swipeleft","swipeend","scrollstart","scrollend","orientationchange"],function(t,i){n.fn[i]=function(n){return n?this.on(i,n):this.trigger(i)};n.attrFn[i]=!0}),n.event.special.tapstart={setup:function(){var r=this,u=n(r);u.on(t.startevent,function f(n){if(u.data("callee",f),n.which&&n.which!==1)return!1;var e=n.originalEvent,o={position:{x:t.touch_capable?e.touches[0].screenX:n.screenX,y:t.touch_capable?e.touches[0].screenY:n.screenY},offset:{x:t.touch_capable?e.touches[0].pageX-e.touches[0].target.offsetLeft:n.offsetX,y:t.touch_capable?e.touches[0].pageY-e.touches[0].target.offsetTop:n.offsetY},time:Date.now(),target:n.target};return i(r,"tapstart",n,o),!0})},remove:function(){n(this).off(t.startevent,n(this).data.callee)}},n.event.special.tapmove={setup:function(){var r=this,u=n(r);u.on(t.moveevent,function f(n){u.data("callee",f);var e=n.originalEvent,o={position:{x:t.touch_capable?e.touches[0].screenX:n.screenX,y:t.touch_capable?e.touches[0].screenY:n.screenY},offset:{x:t.touch_capable?e.touches[0].pageX-e.touches[0].target.offsetLeft:n.offsetX,y:t.touch_capable?e.touches[0].pageY-e.touches[0].target.offsetTop:n.offsetY},time:Date.now(),target:n.target};return i(r,"tapmove",n,o),!0})},remove:function(){n(this).off(t.moveevent,n(this).data.callee)}},n.event.special.tapend={setup:function(){var r=this,u=n(r);u.on(t.endevent,function f(n){u.data("callee",f);var e=n.originalEvent,o={position:{x:t.touch_capable?e.changedTouches[0].screenX:n.screenX,y:t.touch_capable?e.changedTouches[0].screenY:n.screenY},offset:{x:t.touch_capable?e.changedTouches[0].pageX-e.changedTouches[0].target.offsetLeft:n.offsetX,y:t.touch_capable?e.changedTouches[0].pageY-e.changedTouches[0].target.offsetTop:n.offsetY},time:Date.now(),target:n.target};return i(r,"tapend",n,o),!0})},remove:function(){n(this).off(t.endevent,n(this).data.callee)}},n.event.special.taphold={setup:function(){var o=this,u=n(o),s,r={x:0,y:0},f=0,e=0;u.on(t.startevent,function h(n){if(n.which&&n.which!==1)return!1;u.data("tapheld",!1);s=n.target;var c=n.originalEvent,l=Date.now(),a={x:t.touch_capable?c.touches[0].screenX:n.screenX,y:t.touch_capable?c.touches[0].screenY:n.screenY},v={x:t.touch_capable?c.touches[0].pageX-c.touches[0].target.offsetLeft:n.offsetX,y:t.touch_capable?c.touches[0].pageY-c.touches[0].target.offsetTop:n.offsetY};return r.x=n.originalEvent.targetTouches?n.originalEvent.targetTouches[0].pageX:n.pageX,r.y=n.originalEvent.targetTouches?n.originalEvent.targetTouches[0].pageY:n.pageY,f=r.x,e=r.y,t.hold_timer=window.setTimeout(function(){var y=r.x-f,p=r.y-e;if(n.target==s&&(r.x==f&&r.y==e||y>=-t.tap_pixel_range&&y<=t.tap_pixel_range&&p>=-t.tap_pixel_range&&p<=t.tap_pixel_range)){u.data("tapheld",!0);var w=Date.now(),b={x:t.touch_capable?c.touches[0].screenX:n.screenX,y:t.touch_capable?c.touches[0].screenY:n.screenY},k={x:t.touch_capable?c.touches[0].pageX-c.touches[0].target.offsetLeft:n.offsetX,y:t.touch_capable?c.touches[0].pageY-c.touches[0].target.offsetTop:n.offsetY},d=w-l,g={startTime:l,endTime:w,startPosition:a,startOffset:v,endPosition:b,endOffset:k,duration:d,target:n.target};u.data("callee1",h);i(o,"taphold",n,g)}},t.taphold_threshold),!0}).on(t.endevent,function c(){u.data("callee2",c);u.data("tapheld",!1);window.clearTimeout(t.hold_timer)}).on(t.moveevent,function l(n){u.data("callee3",l);f=n.originalEvent.targetTouches?n.originalEvent.targetTouches[0].pageX:n.pageX;e=n.originalEvent.targetTouches?n.originalEvent.targetTouches[0].pageY:n.pageY})},remove:function(){n(this).off(t.startevent,n(this).data.callee1).off(t.endevent,n(this).data.callee2).off(t.moveevent,n(this).data.callee3)}},n.event.special.doubletap={setup:function(){var s=this,r=n(s),h,f,e,u,c,o=!1;r.on(t.startevent,function l(n){return n.which&&n.which!==1?!1:(r.data("doubletapped",!1),h=n.target,r.data("callee1",l),u=n.originalEvent,e={position:{x:t.touch_capable?u.touches[0].screenX:n.screenX,y:t.touch_capable?u.touches[0].screenY:n.screenY},offset:{x:t.touch_capable?u.touches[0].pageX-u.touches[0].target.offsetLeft:n.offsetX,y:t.touch_capable?u.touches[0].pageY-u.touches[0].target.offsetTop:n.offsetY},time:Date.now(),target:n.target},!0)}).on(t.endevent,function a(n){var u=Date.now(),p=r.data("lastTouch")||u+1,v=u-p,l,y;window.clearTimeout(f);r.data("callee2",a);v<t.doubletap_int&&n.target==h&&v>100?(r.data("doubletapped",!0),window.clearTimeout(t.tap_timer),l={position:{x:t.touch_capable?n.originalEvent.changedTouches[0].screenX:n.screenX,y:t.touch_capable?n.originalEvent.changedTouches[0].screenY:n.screenY},offset:{x:t.touch_capable?n.originalEvent.changedTouches[0].pageX-n.originalEvent.changedTouches[0].target.offsetLeft:n.offsetX,y:t.touch_capable?n.originalEvent.changedTouches[0].pageY-n.originalEvent.changedTouches[0].target.offsetTop:n.offsetY},time:Date.now(),target:n.target},y={firstTap:e,secondTap:l,interval:l.time-e.time},o||i(s,"doubletap",n,y),o=!0,c=window.setTimeout(function(){o=!1},t.doubletap_int)):(r.data("lastTouch",u),f=window.setTimeout(function(){window.clearTimeout(f)},t.doubletap_int,[n]));r.data("lastTouch",u)})},remove:function(){n(this).off(t.startevent,n(this).data.callee1).off(t.endevent,n(this).data.callee2)}},n.event.special.singletap={setup:function(){var f=this,r=n(f),e=null,o=null,u={x:0,y:0};r.on(t.startevent,function s(n){return n.which&&n.which!==1?!1:(o=Date.now(),e=n.target,r.data("callee1",s),u.x=n.originalEvent.targetTouches?n.originalEvent.targetTouches[0].pageX:n.pageX,u.y=n.originalEvent.targetTouches?n.originalEvent.targetTouches[0].pageY:n.pageY,!0)}).on(t.endevent,function h(n){if(r.data("callee2",h),n.target==e){var s=n.originalEvent.changedTouches?n.originalEvent.changedTouches[0].pageX:n.pageX,c=n.originalEvent.changedTouches?n.originalEvent.changedTouches[0].pageY:n.pageY;t.tap_timer=window.setTimeout(function(){if(!r.data("doubletapped")&&!r.data("tapheld")&&u.x==s&&u.y==c){var e=n.originalEvent,h={position:{x:t.touch_capable?e.changedTouches[0].screenX:n.screenX,y:t.touch_capable?e.changedTouches[0].screenY:n.screenY},offset:{x:t.touch_capable?e.changedTouches[0].pageX-e.changedTouches[0].target.offsetLeft:n.offsetX,y:t.touch_capable?e.changedTouches[0].pageY-e.changedTouches[0].target.offsetTop:n.offsetY},time:Date.now(),target:n.target};h.time-o<t.taphold_threshold&&i(f,"singletap",n,h)}},t.doubletap_int)}})},remove:function(){n(this).off(t.startevent,n(this).data.callee1).off(t.endevent,n(this).data.callee2)}},n.event.special.tap={setup:function(){var e=this,u=n(e),o=!1,s=null,h,r={x:0,y:0},f;u.on(t.startevent,function c(n){return u.data("callee1",c),n.which&&n.which!==1?!1:(o=!0,r.x=n.originalEvent.targetTouches?n.originalEvent.targetTouches[0].pageX:n.pageX,r.y=n.originalEvent.targetTouches?n.originalEvent.targetTouches[0].pageY:n.pageY,h=Date.now(),s=n.target,f=n.originalEvent.targetTouches?n.originalEvent.targetTouches:[n],!0)}).on(t.endevent,function l(n){var a,y,c,d;u.data("callee2",l);var p=n.originalEvent.targetTouches?n.originalEvent.changedTouches[0].pageX:n.pageX,w=n.originalEvent.targetTouches?n.originalEvent.changedTouches[0].pageY:n.pageY,b=r.x-p,k=r.y-w,v;if(s==n.target&&o&&Date.now()-h<t.taphold_threshold&&(r.x==p&&r.y==w||b>=-t.tap_pixel_range&&b<=t.tap_pixel_range&&k>=-t.tap_pixel_range&&k<=t.tap_pixel_range)){for(a=n.originalEvent,y=[],c=0;c<f.length;c++)d={position:{x:t.touch_capable?a.changedTouches[c].screenX:n.screenX,y:t.touch_capable?a.changedTouches[c].screenY:n.screenY},offset:{x:t.touch_capable?a.changedTouches[c].pageX-a.changedTouches[c].target.offsetLeft:n.offsetX,y:t.touch_capable?a.changedTouches[c].pageY-a.changedTouches[c].target.offsetTop:n.offsetY},time:Date.now(),target:n.target},y.push(d);switch(f.length){case 1:v="tap";break;case 2:v="tap2";break;case 3:v="tap3";break;case 4:v="tap4"}i(e,v,n,y)}})},remove:function(){n(this).off(t.startevent,n(this).data.callee1).off(t.endevent,n(this).data.callee2)}},n.event.special.swipe={setup:function(){function s(o){i=n(o.currentTarget);i.data("callee1",s);u.x=o.originalEvent.targetTouches?o.originalEvent.targetTouches[0].pageX:o.pageX;u.y=o.originalEvent.targetTouches?o.originalEvent.targetTouches[0].pageY:o.pageY;f.x=u.x;f.y=u.y;e=!0;var h=o.originalEvent;r={position:{x:t.touch_capable?h.touches[0].screenX:o.screenX,y:t.touch_capable?h.touches[0].screenY:o.screenY},offset:{x:t.touch_capable?h.touches[0].pageX-h.touches[0].target.offsetLeft:o.offsetX,y:t.touch_capable?h.touches[0].pageY-h.touches[0].target.offsetTop:o.offsetY},time:Date.now(),target:o.target}}function h(s){i=n(s.currentTarget);i.data("callee2",h);f.x=s.originalEvent.targetTouches?s.originalEvent.targetTouches[0].pageX:s.pageX;f.y=s.originalEvent.targetTouches?s.originalEvent.targetTouches[0].pageY:s.pageY;var c,a=i.parent().data("xthreshold")?i.parent().data("xthreshold"):i.data("xthreshold"),v=i.parent().data("ythreshold")?i.parent().data("ythreshold"):i.data("ythreshold"),p=typeof a!="undefined"&&a!==!1&&parseInt(a)?parseInt(a):t.swipe_h_threshold,w=typeof v!="undefined"&&v!==!1&&parseInt(v)?parseInt(v):t.swipe_v_threshold;if(u.y>f.y&&u.y-f.y>w&&(c="swipeup"),u.x<f.x&&f.x-u.x>p&&(c="swiperight"),u.y<f.y&&f.y-u.y>w&&(c="swipedown"),u.x>f.x&&u.x-f.x>p&&(c="swipeleft"),c!=undefined&&e){u.x=0;u.y=0;f.x=0;f.y=0;e=!1;var l=s.originalEvent,y={position:{x:t.touch_capable?l.touches[0].screenX:s.screenX,y:t.touch_capable?l.touches[0].screenY:s.screenY},offset:{x:t.touch_capable?l.touches[0].pageX-l.touches[0].target.offsetLeft:s.offsetX,y:t.touch_capable?l.touches[0].pageY-l.touches[0].target.offsetTop:s.offsetY},time:Date.now(),target:s.target},k=Math.abs(r.position.x-y.position.x),d=Math.abs(r.position.y-y.position.y),b={startEvnt:r,endEvnt:y,direction:c.replace("swipe",""),xAmount:k,yAmount:d,duration:y.time-r.time};o=!0;i.trigger("swipe",b).trigger(c,b)}}function c(u){var s;if(i=n(u.currentTarget),s="",i.data("callee3",c),o){var l=i.data("xthreshold"),a=i.data("ythreshold"),v=typeof l!="undefined"&&l!==!1&&parseInt(l)?parseInt(l):t.swipe_h_threshold,y=typeof a!="undefined"&&a!==!1&&parseInt(a)?parseInt(a):t.swipe_v_threshold,h=u.originalEvent,f={position:{x:t.touch_capable?h.changedTouches[0].screenX:u.screenX,y:t.touch_capable?h.changedTouches[0].screenY:u.screenY},offset:{x:t.touch_capable?h.changedTouches[0].pageX-h.changedTouches[0].target.offsetLeft:u.offsetX,y:t.touch_capable?h.changedTouches[0].pageY-h.changedTouches[0].target.offsetTop:u.offsetY},time:Date.now(),target:u.target};r.position.y>f.position.y&&r.position.y-f.position.y>y&&(s="swipeup");r.position.x<f.position.x&&f.position.x-r.position.x>v&&(s="swiperight");r.position.y<f.position.y&&f.position.y-r.position.y>y&&(s="swipedown");r.position.x>f.position.x&&r.position.x-f.position.x>v&&(s="swipeleft");var p=Math.abs(r.position.x-f.position.x),w=Math.abs(r.position.y-f.position.y),b={startEvnt:r,endEvnt:f,direction:s.replace("swipe",""),xAmount:p,yAmount:w,duration:f.time-r.time};i.trigger("swipeend",b)}e=!1;o=!1}var l=this,i=n(l),e=!1,o=!1,u={x:0,y:0},f={x:0,y:0},r;i.on(t.startevent,s);i.on(t.moveevent,h);i.on(t.endevent,c)},remove:function(){n(this).off(t.startevent,n(this).data.callee1).off(t.moveevent,n(this).data.callee2).off(t.endevent,n(this).data.callee3)}},n.event.special.scrollstart={setup:function(){function o(n,t){r=t;i(u,r?"scrollstart":"scrollend",n)}var u=this,f=n(u),r,e;f.on(t.scrollevent,function s(n){f.data("callee",s);r||o(n,!0);clearTimeout(e);e=setTimeout(function(){o(n,!1)},50)})},remove:function(){n(this).off(t.scrollevent,n(this).data.callee)}},f=n(window),o={"0":!0,"180":!0},t.orientation_support){var p=window.innerWidth||f.width(),w=window.innerHeight||f.height();h=p>w&&p-w>50;c=o[window.orientation];(h&&c||!h&&!c)&&(o={"-90":!0,"90":!0})}n.event.special.orientationchange=g={setup:function(){if(t.orientation_support)return!1;s=e();f.on("throttledresize",l);return!0},teardown:function(){return t.orientation_support?!1:(f.off("throttledresize",l),!0)},add:function(n){var t=n.handler;n.handler=function(n){return n.orientation=e(),t.apply(this,arguments)}}};n.event.special.orientationchange.orientation=e=function(){var i=!0,n=document.documentElement;return i=t.orientation_support?o[window.orientation]:n&&n.clientWidth/n.clientHeight<1.1,i?"portrait":"landscape"};n.event.special.throttledresize={setup:function(){n(this).on("resize",k)},teardown:function(){n(this).off("resize",k)}};var b=250,k=function(){v=Date.now();y=v-d;y>=b?(d=v,n(this).trigger("throttledresize")):(a&&window.clearTimeout(a),a=window.setTimeout(l,b-y))},d=0,a,v,y;n.each({scrollend:"scrollstart",swipeup:"swipe",swiperight:"swipe",swipedown:"swipe",swipeleft:"swipe",swipeend:"swipe",tap2:"tap"},function(t,i){n.event.special[t]={setup:function(){n(this).on(i,n.noop)}}})})(jQuery)

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.5
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.5'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}($);

(function($) {

	$.fn.tableHeadFixer = function(param) {
		var defaults = {
			head: true,
			foot: false,
			left: 0,
			right: 0
		};

		var settings = $.extend({}, defaults, param);

		return this.each(function() {
			settings.table = this;
			settings.parent = $("<div></div>");
			setParent();

			if(settings.head == true)
				fixHead();

			if(settings.foot == true)
				fixFoot();

			if(settings.left > 0)
				fixLeft();

			if(settings.right > 0)
				fixRight();

			// self.setCorner();

			$(settings.parent).trigger("scroll");

			$(window).resize(function() {
				$(settings.parent).trigger("scroll");
			});
		});

		function setTable(table) {

		}


		function setParent() {
			var container = $(settings.table).parent();
			var parent = $(settings.parent);
			var table = $(settings.table);

			table.before(parent);
			parent.append(table);
			parent
				.css({
					'width' : '100%',
					'height' : container.css("height"),
					'overflow' : 'scroll',
					'max-height' : container.css("max-height"),
					'min-height' : container.css("min-height"),
					'max-width' : container.css('max-width'),
					'min-width' : container.css('min-width')
				});

			parent.scroll(function() {
				var scrollWidth = parent[0].scrollWidth;
				var clientWidth = parent[0].clientWidth;
				var scrollHeight = parent[0].scrollHeight;
				var clientHeight = parent[0].clientHeight;
				var top = parent.scrollTop();
				var left = parent.scrollLeft();

				if(settings.head)
					this.find("thead tr > *").css("top", top);

				if(settings.foot)
					this.find("tfoot tr > *").css("bottom", scrollHeight - clientHeight - top);

				if(settings.left > 0)
					settings.leftColumns.css("left", left);

				if(settings.right > 0)
					settings.rightColumns.css("right", scrollWidth - clientWidth - left);
			}.bind(table));
		}

		function fixHead () {
			var thead = $(settings.table).find("thead");
			var tr = thead.find("tr");
			var cells = thead.find("tr > *");

			setBackground(cells);
			cells.css({
				'position' : 'relative'
			});
		}

		function fixFoot () {
			var tfoot = $(settings.table).find("tfoot");
			var tr = tfoot.find("tr");
			var cells = tfoot.find("tr > *");

			setBackground(cells);
			cells.css({
				'position' : 'relative'
			});
		}

		function fixLeft () {
			var table = $(settings.table);

			var fixColumn = settings.left;

			settings.leftColumns = $();

			for(var i = 1; i <= fixColumn; i++) {
				settings.leftColumns = settings.leftColumns
					.add(table.find("tr > *:nth-child(" + i + ")"));
			}

			var column = settings.leftColumns;

			column.each(function(k, cell) {
				var cell = $(cell);

				setBackground(cell);
				cell.css({
					'position' : 'relative'
				});
			});
		}

		function fixRight () {
			var table = $(settings.table);

			var fixColumn = settings.right;

			settings.rightColumns = $();

			for(var i = 1; i <= fixColumn; i++) {
				settings.rightColumns = settings.rightColumns
					.add(table.find("tr > *:nth-last-child(" + i + ")"));
			}

			var column = settings.rightColumns;

			column.each(function(k, cell) {
				var cell = $(cell);

				setBackground(cell);
				cell.css({
					'position' : 'relative'
				});
			});

		}

		function setBackground(elements) {
			elements.each(function(k, element) {
				var element = $(element);
				var parent = $(element).parent();

				var elementBackground = element.css("background-color");
				elementBackground = (elementBackground == "transparent" || elementBackground == "rgba(0, 0, 0, 0)") ? null : elementBackground;

				var parentBackground = parent.css("background-color");
				parentBackground = (parentBackground == "transparent" || parentBackground == "rgba(0, 0, 0, 0)") ? null : parentBackground;

				var background = parentBackground ? parentBackground : "white";
				background = elementBackground ? elementBackground : background;

				element.css("background-color", background);
			});
		}
	};

})(jQuery);
/**
* simplePagination.js v1.6
* A simple jQuery pagination plugin.
* http://flaviusmatis.github.com/simplePagination.js/
*
* Copyright 2012, Flavius Matis
* Released under the MIT license.
* http://flaviusmatis.github.com/license.html
*/

(function($){

	var methods = {
		init: function(options) {
			var o = $.extend({
				items: 1,
				itemsOnPage: 1,
				pages: 0,
				displayedPages: 5,
				edges: 2,
				currentPage: 0,
				hrefTextPrefix: '#page-',
				hrefTextSuffix: '',
				prevText: 'Prev',
				nextText: 'Next',
				ellipseText: '&hellip;',
				ellipsePageSet: true,
				cssStyle: 'light-theme',
				listStyle: '',
				labelMap: [],
				selectOnClick: true,
				nextAtFront: false,
				invertPageOrder: false,
				useStartEdge : true,
				useEndEdge : true,
				onPageClick: function(pageNumber, event) {
					// Callback triggered when a page is clicked
					// Page number is given as an optional parameter
				},
				onInit: function() {
					// Callback triggered immediately after initialization
				}
			}, options || {});

			var self = this;

			o.pages = o.pages ? o.pages : Math.ceil(o.items / o.itemsOnPage) ? Math.ceil(o.items / o.itemsOnPage) : 1;
			if (o.currentPage)
				o.currentPage = o.currentPage - 1;
			else
				o.currentPage = !o.invertPageOrder ? 0 : o.pages - 1;
			o.halfDisplayed = o.displayedPages / 2;

			this.each(function() {
				self.addClass(o.cssStyle + ' simple-pagination').data('pagination', o);
				methods._draw.call(self);
			});

			o.onInit();

			return this;
		},

		selectPage: function(page) {
			methods._selectPage.call(this, page - 1);
			return this;
		},

		prevPage: function() {
			var o = this.data('pagination');
			if (!o.invertPageOrder) {
				if (o.currentPage > 0) {
					methods._selectPage.call(this, o.currentPage - 1);
				}
			} else {
				if (o.currentPage < o.pages - 1) {
					methods._selectPage.call(this, o.currentPage + 1);
				}
			}
			return this;
		},

		nextPage: function() {
			var o = this.data('pagination');
			if (!o.invertPageOrder) {
				if (o.currentPage < o.pages - 1) {
					methods._selectPage.call(this, o.currentPage + 1);
				}
			} else {
				if (o.currentPage > 0) {
					methods._selectPage.call(this, o.currentPage - 1);
				}
			}
			return this;
		},

		getPagesCount: function() {
			return this.data('pagination').pages;
		},

		setPagesCount: function(count) {
			this.data('pagination').pages = count;
		},

		getCurrentPage: function () {
			return this.data('pagination').currentPage + 1;
		},

		destroy: function(){
			this.empty();
			return this;
		},

		drawPage: function (page) {
			var o = this.data('pagination');
			o.currentPage = page - 1;
			this.data('pagination', o);
			methods._draw.call(this);
			return this;
		},

		redraw: function(){
			methods._draw.call(this);
			return this;
		},

		disable: function(){
			var o = this.data('pagination');
			o.disabled = true;
			this.data('pagination', o);
			methods._draw.call(this);
			return this;
		},

		enable: function(){
			var o = this.data('pagination');
			o.disabled = false;
			this.data('pagination', o);
			methods._draw.call(this);
			return this;
		},

		updateItems: function (newItems) {
			var o = this.data('pagination');
			o.items = newItems;
			o.pages = methods._getPages(o);
			this.data('pagination', o);
			methods._draw.call(this);
		},

		updateItemsOnPage: function (itemsOnPage) {
			var o = this.data('pagination');
			o.itemsOnPage = itemsOnPage;
			o.pages = methods._getPages(o);
			this.data('pagination', o);
			methods._selectPage.call(this, 0);
			return this;
		},

		getItemsOnPage: function() {
			return this.data('pagination').itemsOnPage;
		},

		_draw: function() {
			var	o = this.data('pagination'),
				interval = methods._getInterval(o),
				i,
				tagName;

			methods.destroy.call(this);

			tagName = (typeof this.prop === 'function') ? this.prop('tagName') : this.attr('tagName');

			var $panel = tagName === 'UL' ? this : $('<ul' + (o.listStyle ? ' class="' + o.listStyle + '"' : '') + '></ul>').appendTo(this);

			// Generate Prev link
			if (o.prevText) {
				methods._appendItem.call(this, !o.invertPageOrder ? o.currentPage - 1 : o.currentPage + 1, {text: o.prevText, classes: 'prev'});
			}

			// Generate Next link (if option set for at front)
			if (o.nextText && o.nextAtFront) {
				methods._appendItem.call(this, !o.invertPageOrder ? o.currentPage + 1 : o.currentPage - 1, {text: o.nextText, classes: 'next'});
			}

			// Generate start edges
			if (!o.invertPageOrder) {
				if (interval.start > 0 && o.edges > 0) {
					if(o.useStartEdge) {
						var end = Math.min(o.edges, interval.start);
						for (i = 0; i < end; i++) {
							methods._appendItem.call(this, i);
						}
					}
					if (o.edges < interval.start && (interval.start - o.edges != 1)) {
						$panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
					} else if (interval.start - o.edges == 1) {
						methods._appendItem.call(this, o.edges);
					}
				}
			} else {
				if (interval.end < o.pages && o.edges > 0) {
					if(o.useStartEdge) {
						var begin = Math.max(o.pages - o.edges, interval.end);
						for (i = o.pages - 1; i >= begin; i--) {
							methods._appendItem.call(this, i);
						}
					}

					if (o.pages - o.edges > interval.end && (o.pages - o.edges - interval.end != 1)) {
						$panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
					} else if (o.pages - o.edges - interval.end == 1) {
						methods._appendItem.call(this, interval.end);
					}
				}
			}

			// Generate interval links
			if (!o.invertPageOrder) {
				for (i = interval.start; i < interval.end; i++) {
					methods._appendItem.call(this, i);
				}
			} else {
				for (i = interval.end - 1; i >= interval.start; i--) {
					methods._appendItem.call(this, i);
				}
			}

			// Generate end edges
			if (!o.invertPageOrder) {
				if (interval.end < o.pages && o.edges > 0) {
					if (o.pages - o.edges > interval.end && (o.pages - o.edges - interval.end != 1)) {
						$panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
					} else if (o.pages - o.edges - interval.end == 1) {
						methods._appendItem.call(this, interval.end);
					}
					if(o.useEndEdge) {
						var begin = Math.max(o.pages - o.edges, interval.end);
						for (i = begin; i < o.pages; i++) {
							methods._appendItem.call(this, i);
						}
					}
				}
			} else {
				if (interval.start > 0 && o.edges > 0) {
					if (o.edges < interval.start && (interval.start - o.edges != 1)) {
						$panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
					} else if (interval.start - o.edges == 1) {
						methods._appendItem.call(this, o.edges);
					}

					if(o.useEndEdge) {
						var end = Math.min(o.edges, interval.start);
						for (i = end - 1; i >= 0; i--) {
							methods._appendItem.call(this, i);
						}
					}
				}
			}

			// Generate Next link (unless option is set for at front)
			if (o.nextText && !o.nextAtFront) {
				methods._appendItem.call(this, !o.invertPageOrder ? o.currentPage + 1 : o.currentPage - 1, {text: o.nextText, classes: 'next'});
			}

			if (o.ellipsePageSet && !o.disabled) {
				methods._ellipseClick.call(this, $panel);
			}

		},

		_getPages: function(o) {
			var pages = Math.ceil(o.items / o.itemsOnPage);
			return pages || 1;
		},

		_getInterval: function(o) {
			return {
				start: Math.ceil(o.currentPage > o.halfDisplayed ? Math.max(Math.min(o.currentPage - o.halfDisplayed, (o.pages - o.displayedPages)), 0) : 0),
				end: Math.ceil(o.currentPage > o.halfDisplayed ? Math.min(o.currentPage + o.halfDisplayed, o.pages) : Math.min(o.displayedPages, o.pages))
			};
		},

		_appendItem: function(pageIndex, opts) {
			var self = this, options, $link, o = self.data('pagination'), $linkWrapper = $('<li></li>'), $ul = self.find('ul');

			pageIndex = pageIndex < 0 ? 0 : (pageIndex < o.pages ? pageIndex : o.pages - 1);

			options = {
				text: pageIndex + 1,
				classes: ''
			};

			if (o.labelMap.length && o.labelMap[pageIndex]) {
				options.text = o.labelMap[pageIndex];
			}

			options = $.extend(options, opts || {});

			if (pageIndex == o.currentPage || o.disabled) {
				if (o.disabled || options.classes === 'prev' || options.classes === 'next') {
					$linkWrapper.addClass('disabled');
				} else {
					$linkWrapper.addClass('active');
				}
				$link = $('<span class="current">' + (options.text) + '</span>');
			} else {
				$link = $('<a href="' + o.hrefTextPrefix + (pageIndex + 1) + o.hrefTextSuffix + '" class="page-link">' + (options.text) + '</a>');
				$link.click(function(event){
					return methods._selectPage.call(self, pageIndex, event);
				});
			}

			if (options.classes) {
				$link.addClass(options.classes);
			}

			$linkWrapper.append($link);

			if ($ul.length) {
				$ul.append($linkWrapper);
			} else {
				self.append($linkWrapper);
			}
		},

		_selectPage: function(pageIndex, event) {
			var o = this.data('pagination');
			o.currentPage = pageIndex;
			if (o.selectOnClick) {
				methods._draw.call(this);
			}
			return o.onPageClick(pageIndex + 1, event);
		},


		_ellipseClick: function($panel) {
			var self = this,
				o = this.data('pagination'),
				$ellip = $panel.find('.ellipse');
			$ellip.addClass('clickable').parent().removeClass('disabled');
			$ellip.click(function(event) {
				if (!o.disable) {
					var $this = $(this),
						val = (parseInt($this.parent().prev().text(), 10) || 0) + 1;
					$this
						.html('<input type="number" min="1" max="' + o.pages + '" step="1" value="' + val + '">')
						.find('input')
						.focus()
						.click(function(event) {
							// prevent input number arrows from bubbling a click event on $ellip
							event.stopPropagation();
						})
						.keyup(function(event) {
							var val = $(this).val();
							if (event.which === 13 && val !== '') {
								// enter to accept
								if ((val>0)&&(val<=o.pages))
								methods._selectPage.call(self, val - 1);
							} else if (event.which === 27) {
								// escape to cancel
								$ellip.empty().html(o.ellipseText);
							}
						})
						.bind('blur', function(event) {
							var val = $(this).val();
							if (val !== '') {
								methods._selectPage.call(self, val - 1);
							}
							$ellip.empty().html(o.ellipseText);
							return false;
						});
				}
				return false;
			});
		}

	};

	$.fn.pagination = function(method) {

		// Method calling logic
		if (methods[method] && method.charAt(0) != '_') {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.pagination');
		}

	};

})(jQuery);

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

