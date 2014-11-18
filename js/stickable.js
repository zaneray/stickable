//95 plus four Pennies

(function($) {
  $.fn.stickable = function(args) {

    var options = {
      margin : 0,
      marginTop: null,
      marginBottom: null,
      bottomId : null, 
      stickyBreakpoint : 768 // Anything below this number stickable is disabled
    };



    $.extend(options, args);
    if (options.bottomId === null) {
      alert('Please specify a bottomId');
    }  

    //set the top and bottom values to .margin
    if(options.marginTop === null) {
      options.marginTop = options.margin;
    }

    if(options.marginBottom === null) {
      options.marginBottom = options.margin;
    }  

    var $el = this, 
      $elParent = $el.parent(),
      $window = $(window), 
      $bottom = $('#' + options.bottomId), 
      windowTop = $window.scrollTop(), 
      stickyActive = false, 
      fixedTop = true, 
      winHeight = $window.height(), 
      winWidth = $window.width(),  
      elOffset = $elParent.offset().top, 
      elHeight = $el.outerHeight(),
      fixedStart = elOffset + elHeight - winHeight + options.marginBottom; 
      bottomOffset = $bottom.offset().top,
      isTouch      = 'ontouchstart' in window || navigator.msMaxTouchPoints;

    var destroySticky = function() {
      //note don't set any other inline styles on this baby or it will screw everything up
      stickyActive = false;
      $el.removeAttr('style').removeClass("stickable-fixed-bottom").removeClass("stickable-fixed-top").removeClass("stickable-fixed");
      $elParent.removeClass("stickable-parent");
      $window.off('scroll', scrollSticky);
    };
      
    var wordcheck = null;

    /*method that can reset all the demensions for the plugin. useful if anything changes the 
    dimensions of the page or the sticky Element. */
    $.fn.stickable.reset = function(newBottom) {
      elHeight = $el.outerHeight();
      elOffset = $el.parent().offset().top;
      if ( newBottom != null ) {
        bottomOffset = $("#"+newBottom).offset().top;
      }
      else{
        bottomOffset = $bottom.offset().top; 
      }
      fixedStart = elOffset + elHeight - winHeight + options.marginBottom;
    };

    /*method to destroy stickable altogether */
    $.fn.stickable.destroy = function() {
      destroySticky();
    }

    if (this.length > 0) {
      
      var scrollSticky = function() { 
        windowTop = $window.scrollTop();
        if (fixedTop === true) {
          /********************************************
           FIXED TOP
           fix only to the top if it is shorter
           than the window
           ********************************************/
          if (elOffset < windowTop + options.marginTop) {
            if ((windowTop + elHeight + options.marginTop + options.marginBottom) > bottomOffset) {
              $el.addClass('stickable-fixed-bottom').removeClass('stickable-fixed-top').css({
                'top': parseInt(bottomOffset - elHeight - elOffset - options.marginBottom) + 'px',
                'bottom': 'auto'
              });
            } else { 
              $el.addClass('stickable-fixed-top').removeClass('stickable-fixed-bottom').css('top', options.marginTop + 'px');
            }
          } else {
            $el.removeClass('stickable-fixed-top').removeClass('stickable-fixed-bottom').css('top', 'auto');
          }
        } else {
          /********************************************
           FIXED BOTTOM
           fix  to the bottom if it is taller
           than the window
           ********************************************/
          //fix  to the bottom if it is taller than the window
          if (fixedStart < windowTop) {
            if (windowTop + winHeight > bottomOffset) {
                $el.addClass('stickable-fixed-bottom').removeClass('stickable-fixed-top').css({
                  'top': parseInt(bottomOffset - elHeight - elOffset - options.marginBottom) + 'px',
                  'bottom': 'auto'
                });
            } else {
              $el.addClass('stickable-fixed').removeClass('stickable-fixed-bottom').css('top', 'auto').css('bottom', options.marginBottom + 'px');
            }
          } else {
            $el.removeClass('stickable-fixed').removeClass('stickable-fixed-bottom').css({
              'top' : 'auto',
              'bottom' : 'auto'
            });
          }
        }
      };
      //end scrollSticky

      //initSticky() function that initializes stickable
      var initSticky = function() {
        stickyActive = true;
        $elParent.addClass('stickable-parent');
        $el.outerWidth($elParent.outerWidth());
        if ((elHeight + (options.marginTop  + options.marginBottom)) < winHeight) {
          fixedTop = true;
        } else {
          fixedTop = false;
        }

        $window.on('scroll', scrollSticky);
      };
      //end initSticky();

      //called to reinit and fix stuff when you resize you sticky sidebar. 
      var stickyResize = function(){
        winWidth = $window.width();
        if (winWidth >= options.stickyBreakpoint) {
          $(this).stickable.reset();
          //continue we are at a larger screen
          if (stickyActive === false) {
            //no sticky then init
            initSticky();
          } else {
            //just resizing no biggie            
            $el.width($elParent.width());
          }
        } else if (winWidth < options.stickyBreakpoint && stickyActive === true) {
          destroySticky();
        }
      };
    } // end if (this.length > 0)

    //do this on $window.load(); if the window Width is larger than the sticky breakpoint fire it up. 
    if (winWidth >= options.stickyBreakpoint) {
      //continue we are at a larger screen
      initSticky();
    }

    //if the page loads and the window is already scrolled down call the scroll function.
    if(windowTop > 0) {
      scrollSticky();
    }

    //resize with a simple throttling function built in.
    if(isTouch){
      var resizeTimeout;
      $window.on('resize orientationchange', function(){
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(stickyResize, 200);
      });
      
    }
    else {      
      $window.on('resize', function(){
        stickyResize();  
      });      
    }
  }; //end $.fn.stickable

})(jQuery);
