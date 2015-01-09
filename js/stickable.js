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

    var $el                 = this, 
        $elParent           = $el.parent(),
        $window             = $(window), 
        $bottom             = $('#' + options.bottomId), 
        windowTop           = $window.scrollTop(), 
        stickyActive        = false, 
        fixedTop            = true, 
        winHeight           = $window.height(), 
        winWidth            = $window.width(),  
        elOffset            = $elParent.offset().top, 
        elHeight            = $el.outerHeight(),
        //fixedStart        = elOffset + elHeight - winHeight + options.marginBottom,
        dynamicTopPosition  = 0,
        bottomOffset        = $bottom.offset().top,
        downStart           = elOffset +  dynamicTopPosition + elHeight + options.marginBottom - winHeight,
        downEnd             = bottomOffset - winHeight,    
        upStart             = dynamicTopPosition + elOffset + options.marginTop,
        upEnd               = elOffset,    
        shortBottomPosition = bottomOffset - elOffset - elHeight -  options.marginBottom, //used for short elements to create a bottom Threshold
        //fixedStatus         = 'static', //keep track of the status values: top, bottom, absolute, or static
        scrollDirection     = 'down', //alternately it can be up
        isTouch             = 'ontouchstart' in window || navigator.msMaxTouchPoints;


    /* TODO function that sets up initial dimension and dimensions
    var setDimensions = function(){

    };
    */


    var destroySticky = function() {
      //note don't set any other inline styles on this baby or it will screw everything up
      stickyActive = false;
      $el.removeAttr('style').removeClass("stickable-absolute").removeClass("stickable-fixed-top").removeClass("stickable-fixed");
      $elParent.removeClass("stickable-parent");
      $window.off('scroll', scrollSticky);
    };


    /*method that can reset all the demensions for the plugin. useful if anything changes the 
    dimensions of the page or the sticky Element. */
    $.fn.stickable.reset = function() {
      console.log('reset called');
      elHeight = $el.outerHeight();
      elOffset = $el.parent().offset().top;
      bottomOffset = $bottom.offset().top; 
      dynamicTopPosition = $el.offset().top - elOffset;
      upStart = dynamicTopPosition + elOffset + options.marginTop;
      shortBottomPosition = bottomOffset - elOffset - elHeight -  options.marginBottom,
      upEnd = elOffset;
      downStart = elOffset + elHeight + dynamicTopPosition + options.marginBottom - winHeight;
      downEnd = bottomOffset - winHeight;
      $window.trigger('scroll'); 
    };

    /*method to destroy stickable altogether */
    $.fn.stickable.destroy = function() {
      destroySticky();
    };

    if (this.length > 0) { //check if it exists. 
      
      var scrollSticky = function() { 
        //elTopPosition needs to be scoped to this because we have multiple elements that can be sticky.
        var elTopPosition = parseInt(bottomOffset - elHeight - elOffset - options.marginBottom);
        var bottomTrigger = bottomOffset - (elHeight + options.marginBottom)
        //before resetting windowTop we compare them to figure out the scroll direction down/up
        // console.log('----------------------------------');
        // console.log('$window.scrollTop(): ' + $window.scrollTop());
        // console.log('elTopPosition: ' + elTopPosition);
        // console.log('downStart: ' + downStart);
        if($window.scrollTop() > windowTop) {
          scrollDirection = 'down';
        }
        else {
          scrollDirection = 'up';
        }
        //console.log('scrollDirection:' + scrollDirection);
        windowTop = $window.scrollTop();
        if (fixedTop === true) {
          /********************************************
           FIXED TOP
           fix only to the top if it is shorter
           than the window
           ********************************************/
          if (elOffset < windowTop + options.marginTop) {
            //dynamicTopPosition = $el.offset().top  + options.marginBottom;
            //downStart = elOffset +  dynamicTopPosition + elHeight + options.marginTop + options.marginBottom - winHeight;
             console.log('__________________');
            //console.log('dynamicTopPosition: ' + dynamicTopPosition);
            bottomTrigger = bottomOffset - (elHeight + options.marginBottom + options.marginTop);
            //console.log('dynamicTopPosition: ' + dynamicTopPosition);
            //console.log('downStart: ' + downStart);
            console.log('bottomOffset: ' + bottomOffset);
            //console.log('bottomTrigger: ' + bottomTrigger);
            //console.log('elHeight: ' + elHeight);
            //if (dynamicTopPosition > bottomTrigger) {
            if((windowTop + elHeight  + options.marginBottom  + options.marginTop) > bottomOffset){
              console.log('step 2 Eureka!');

              $el.addClass('stickable-absolute').removeClass('stickable-fixed-top').removeClass('stickable-fixed-bottom').css({
                'top': shortBottomPosition + 'px',
                'bottom': 'auto'
              });
              //console.log('FIXED TOP \ndownStart > bottomOffset\n stickable-absolute \n top: ' + elTopPosition + ' \n bottom: auto \n ===============');
            } else { 
              //console.log('step 3');
              $el.addClass('stickable-fixed-top').removeClass('stickable-absolute').removeClass('stickable-fixed-bottom').css({
                'top': options.marginTop + 'px',
                'bottom': 'auto'
              });
              //console.log('FIXED TOP \ndownStart < bottomOffset\n stickable-fixed-top \n top: options.marginTop \n bottom: auto \n ===============');
            }
          } else {
             //console.log('step 4');
            $el.removeClass('stickable-fixed-top').removeClass('stickable-absolute').removeClass('stickable-fixed-bottom').css({
              'top' : 'auto',
              'bottom' : 'auto'
            });
            //console.log('FIXED TOP \n remove stickable-fixed-bottom,stickable-absolute \n top: auto \n bottom: auto \n ===============');
          }
        } else {




          /********************************************
           FIXED BOTTOM
           can fix  to the bottom if it is taller
           than the window 
           ********************************************/
          if(scrollDirection === 'down') {
            dynamicTopPosition = $el.offset().top - elOffset;
            upStart = dynamicTopPosition + elOffset + options.marginTop;
            //console.log('dynamicTopPosition: ' + dynamicTopPosition);
            //going down
            if(windowTop < downStart) {
              $el.addClass('stickable-absolute')
                .removeClass('stickable-fixed-top')
                .removeClass('stickable-fixed-bottom')
                .css({
                  'top': dynamicTopPosition + 'px',
                  'bottom': 'auto'
                });
                //console.log('windowTop < downStart \n stickable-absolute \n top: ' + dynamicTopPosition + ' \n bottom: auto\n ===============');
            } else 
            if (windowTop > downStart && windowTop < downEnd) {
              $el.addClass('stickable-fixed-bottom')
                .removeClass('stickable-fixed-top')
                .removeClass('stickable-absolute')
                .css({
                  'top': 'auto',
                  'bottom': options.marginBottom + 'px'
                });
              //console.log('stickable-fixed-bottom \n top auto \n bottom: options.marginBottom\n ===============');
            } else 
            if (windowTop > downEnd) {
              $el.addClass('stickable-absolute')
                  .removeClass('stickable-fixed-top')
                  .removeClass('stickable-fixed-bottom')
                  .css({
                    'top': elTopPosition + 'px',
                    'bottom': 'auto'
                  });
                  //fixedStatus = 'bottom';
                //console.log('stickable-absolute \n top: ' + elTopPosition + ' \n bottom: auto\n ===============');
            }
            else {
              //console.log('WTF should be no way to get here');
            }
          }
          else {
            //going up code
            dynamicTopPosition = $el.offset().top - elOffset;
            downStart = elOffset + elHeight + dynamicTopPosition + options.marginBottom - winHeight;
            
            if (windowTop < upEnd - options.marginTop) {
              $el.addClass('stickable-absolute')
                .removeClass('stickable-fixed-top')
                .removeClass('stickable-fixed-bottom')
                .css({
                  'top': 0 + 'px',
                  'bottom': 'auto'
                });
                //console.log('windowTop < upEnd \n stickable-absolute \n top: ' + options.marginTop + ' \n bottom: auto\n ===============');
            } else 
            if (windowTop  > upEnd && windowTop < upStart - (options.marginTop * 2)) {
              $el.addClass('stickable-fixed-top')
                .removeClass('stickable-absolute')
                .removeClass('stickable-fixed-bottom')
                .css({
                  'top': options.marginTop + 'px',
                  'bottom': 'auto'
                });



                //fixedStatus = 'bottom';
              //console.log('windowTop > upEnd && windowTop < upStart \n stickable-fixed-top \n top: ' + options.marginTop + ' \n bottom: auto\n ===============');
            } else 
            if (windowTop > upStart) {
              $el.addClass('stickable-absolute')
                .removeClass('stickable-fixed-top')
                .removeClass('stickable-fixed-bottom')
                .css({
                  'top': dynamicTopPosition + 'px',
                  'bottom': 'auto'
                });
                  //fixedStatus = 'bottom';
                //console.log('windowTop > upStart \n stickable-absolute \n top: ' + dynamicTopPosition + ' \n bottom: auto\n ===============');
            }
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
          //bigger than the window
          fixedTop = true;
        } else {
          //smaller than the window
          fixedTop = false;
        }

        $window.on('scroll', scrollSticky);

        //if we're scrolled down the page trigger a scroll so that it sets the sticky in the right place
        if(windowTop > 0) {
          $window.scrollTop(windowTop + 1);
        }
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
            $el.outerWidth($elParent.width());
          }
        } else if (winWidth < options.stickyBreakpoint && stickyActive === true) {
          destroySticky();
        }
      };

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

    } // end if (this.length > 0)

    
  }; //end $.fn.stickable

})(jQuery);
