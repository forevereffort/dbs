//==============================================================
// CUSTOM SCRIPTS
// 2017
// ==============================================================
$ = jQuery;


$(document).ready(function () {
     
    //fixing safari bottom bar overlapping
  var md = new MobileDetect(window.navigator.userAgent);
  if (md.userAgent() === 'Safari' && md.os() === 'iOS') {
        $('body').addClass('issafari');
  }
  
  $('.filter-trigger').on('click', function(){
        $(this).toggleClass('active');
        $('.filter-button-group').toggleClass('slide-in');
  });

  $('.pop-up a.btn, .overlay').on('click', function(){
		    $('#mainvideo').get(0).pause();
        $('.pop-up,.overlay').fadeOut(1000);
  });
     
});



$(window).on('load', function(){
    var $grid = $('.post-pool').isotope({
      // options
      itemSelector: '.post-item',
      masonry: {
        horizontalOrder: true
      }
    });
  
    $grid.imagesLoaded().progress( function() {
        $grid.isotope('layout');
    });

    $grid.isotope( 'on', 'arrangeComplete', function() {
        var winWidth = $(window).width();
        if( winWidth > 1719){
           desktopClass(6);
        }else if(winWidth > 1399){
            desktopClass(5);
        }else if(winWidth > 1279){
            desktopClass(4);
        }else if(winWidth > 767){
            desktopClass(3);
        }else{
            desktopClass(1);
        }
        updateStartEndDates();
     });

    // filter items on button click
    $('.filter-button-group').on( 'click', 'a', function() {
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
        $('.filter-button-group a').removeClass('active');
        $(this).addClass('active');
    });

    $(".template0listing").mCustomScrollbar({
        theme:"rounded",
        documentTouchScroll: false,
        mouseWheel:{ scrollAmount: 50 },
        callbacks:{
            onUpdate:function(){
              $('.template0listing').mCustomScrollbar('scrollTo',['top',null]);
            },
            whileScrolling:function(){
                  /*$('.post-pool').find('.desktop').each(function(){
                    var test = $(this).offset(),
                      ttop = test.top;
                      if(ttop <= 300){
                        var reqDate = $(this).attr('data-date');
                         $('.mCSB_dragger_bar').text(reqDate);
                      }
                  });*/
                  $('.post-pool').find('.desktop').each(function(){
                    if ($(this).is(":mcsInView")){
                      $('.mCSB_dragger_bar').text($(this).attr('data-date'));
                    }
                  });
			       }
		      }
    });  

    var winWidth = $(window).width();
    if( winWidth > 1719){
           desktopClass(6);
        } else if (winWidth > 1399){
            desktopClass(5);
    } else if (winWidth > 1279){
            desktopClass(4);
        } else if (winWidth > 767){
            desktopClass(3);
    } else {
            desktopClass(1);
        }
  
    updateStartEndDates();

    $('.scroll-top').click(function(){
        $('.template0listing').mCustomScrollbar('scrollTo',['top',null]);
    }) 

}); //end on window load


function desktopClass(elem){
        $('.post-item').removeClass('desktop');
        var i = 0;
        $('.post-item').finish();
        $('.post-item:visible').each(function(){
            if(i % elem == 0){
                $(this).addClass('desktop');
            }
            i++;
        });
}


function updateStartEndDates(){
    var dateArray = [];
    $('.post-item:visible').each(function(){
        dateArray.push($(this).attr('data-date').split(' ')[0]);

    });
    var startDate = Math.min.apply(Math, dateArray),
        endDate = Math.max.apply(Math, dateArray);

        $('.start-date').text(startDate);
        $('.end-date').text(endDate);
        $('.mCSB_dragger_bar').text(startDate);
}

//==============================================================
// Window Resize
// ==============================================================

var resizeTimer; // Set resizeTimer to empty so it resets on page load

function resizeFunction() {
    var $grid = $('.post-pool').isotope({
      // options
      itemSelector: '.post-item',
      masonry: {
        horizontalOrder: true
      }
    });
     $grid.isotope( 'on', 'arrangeComplete', function() {

        var winWidth = $(window).width();
        if( winWidth > 1719){
           desktopClass(6);
        } else if (winWidth > 1399){
            desktopClass(5);

        } else if (winWidth > 1279){
            desktopClass(4);

        } else if (winWidth > 767){
            desktopClass(3);

        } else {
            desktopClass(1);

        }
        updateStartEndDates(); 
     });

}

$(window).resize(function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeFunction, 250);
});
