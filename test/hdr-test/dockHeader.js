var dockHeader = (function () {
    'use strict';

    return {

        isDetailMenuDocked: false,
        menuTargetHeight: undefined,
        topScrollPos: 0,
        dockedHeaderOffset: 133,

        debounce: function (func, wait, immediate) {
            var timeout;
            return function () {
                var context = this, args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate){ func.apply(context, args); }
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow){ func.apply(context, args); }
            };
        },

        toggleDockHeader: function (e) {
            var that;
            if (typeof e === 'undefined') {
                that = this;
            }
            else {
                that = e.data.that;
            }
            that.topScrollPos = that.getTopScrollPos();
            if (that.topScrollPos >= that.menuTargetHeight && that.isDetailMenuDocked === false) {
                that.dockHeader(that);
            }
            else if (that.topScrollPos < that.menuTargetHeight && that.isDetailMenuDocked === true) {
                that.undockHeader(that);
            }
        },

        dockHeader: function(that) {
        	that.isDetailMenuDocked = true;
            $('.header-container').addClass('docked');
            console.log(that.menuTargetHeight + that.dockedHeaderOffset + 40);
            $('.shop.device-details > .main-container').css('margin-top', that.menuTargetHeight + that.dockedHeaderOffset + 40);; 
        },

        undockHeader: function(that) {
          	that.isDetailMenuDocked = false;
            $('.header-container').removeClass('docked');
            $('.shop.device-details > .main-container').css('margin-top', 0);
        },

        getTopScrollPos: function () {
            var body = document.body;
            var d = document.documentElement;
            if (body && body.scrollTop) {
                return body.scrollTop;
            }
            if (d && d.scrollTop) {
                return d.scrollTop;
            }
            if (window.pageYOffset) {
                return window.pageYOffset;
            }
            return 0;
        },

        decorateDockedSelectors: function () {
            $('.colour-select').selectBoxIt({
                autoWidth: false,
                isDeviceListPage: true,
                showEffect: 'slideDown',
                showEffectSpeed: 100
            });
        },

        setMenuTargetHeight: function() {
            if(dockHeader.isDetailMenuDocked) {                
                this.menuTargetHeight = $('.device-details-wrapper').offset().top - this.dockedHeaderOffset - 40;
            }
            else {
                this.menuTargetHeight = $('.device-details-wrapper').offset().top - 40;
            }
        },

        init: function() {            
            this.setMenuTargetHeight();
    		this.toggleDockHeader();
    		var mainObj = this;
            /* do not register below resize event if IE8 */
            if(!($('html').hasClass('legacy'))) {
                $(window).resize(dockHeader.debounce(function() {
            		if(mainObj.isDetailMenuDocked) {
                		mainObj.undockHeader(mainObj);
                	}                
                    mainObj.setMenuTargetHeight();
    				mainObj.toggleDockHeader();            
                }, 100));
            }
        }

    };

})();

$(window).load(function () {
    'use strict';

	dockHeader.init();
	$(window).unbind('scroll DOMMouseScroll mousewheel').bind('scroll DOMMouseScroll mousewheel', {that: dockHeader}, dockHeader.toggleDockHeader);  
});

$(function(){
    dockHeader.decorateDockedSelectors();
});
