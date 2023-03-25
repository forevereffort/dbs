//==============================================================
// CUSTOM SCRIPTS
// 2017
// ==============================================================
$ = jQuery;

function ie() {
  if (document.documentMode || /Edge/.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
}

function minXS() {
  return Modernizr.mq('(min-width: 0px)');
}

function minSM() {
  return Modernizr.mq('(min-width: 321px)');
}

function minMD() {
  return Modernizr.mq('(min-width: 768px)');
}

function minLG() {
  return Modernizr.mq('(min-width: 1280px)');
}


function maxXS() {
  return Modernizr.mq('(max-width: 320px)');
}

function maxSM() {
  return Modernizr.mq('(max-width: 767px)');
}

function maxMD() {
  return Modernizr.mq('(max-width: 1279px)');
}

function initFancybox(){

}

function initOwl(){
  console.log("initOwl");
  var owl = $('.owl-carousel');

  owl.on('initialized.owl.carousel', event => {
        console.log("owl initialized");
        var itemCount = event.item.count;
        if (minLG()) {
          scrollSize = 3;
        } else if (minMD()) {
          scrollSize = 2;
        } else {
          scrollSize = 1;
        }
    
       if(itemCount <= scrollSize) {
         $(".dotsContainer").css('display', 'none');
       }
        
    
        //initFancybox();
  });

  owl.owlCarousel({
        loop: false,
        dots: true,
        //autoWidth:true,
        dotsContainer: '.dotsContainer',
        nav: true,
        margin:30,
        responsiveClass:true,
        responsive:{
            0:{
                items:1
            },
            768:{
                items:2
            },
            1280:{
                items:3
            }
        }
    });

 

}

function loadTimelineJs(){

  //var getUrlPath = document.querySelector('link[rel="basepath"]').href;

  //var timelineJson = getUrlPath + "js/" + $('#timeline-embed').attr('data-json') + ".json";
  
  var timelineJson = "js/" + $('#timeline-embed').attr('data-json') + ".json";

  console.log(timelineJson);
  
  if (maxMD()) {
    var timeNavHeight = 100;
  }
  else {
    var timeNavHeight = 100;
  }

  var additionalOptions = {
      //start_at_end: true,
      font: 'Open Sans',
      default_bg_color: '#fff',
      timenav_height: timeNavHeight,
      scale_factor: 1,
      timenav_position: 'bottom',
      optimal_tick_width: 100,
  }

  window.timeline = new TL.Timeline('timeline-embed', timelineJson, additionalOptions);

}

function get_url_extension( url ) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
}

function loadDetail(val){
  //console.log(val);
  $('.detail-drawer').addClass('active');

  var urlExt = get_url_extension( window.location.href );
  var urlToLoad = val + "." + urlExt;

  $( ".detail-content" ).load( urlToLoad + " .detail-content > div", function( response, status, xhr ) {
    if ( status == "error" ) {
      console.log( xhr.status + " " + xhr.statusText );
    }
    else if (status == "success") {
      window.history.replaceState(val, val, "?detail=" + val);

      $('.detail-nav').prepend('<div class="detail-close">X Close</div>');

      if ($('.detail-overlay').hasClass('active')){
        var scrollTargetPos = document.querySelector('[data-detail="' + val +'"]').offsetTop;
        //scroll to detail section
       $('.vert-timeline-scrollwrap').animate({
            scrollTop: scrollTargetPos
        }, 400);

      }
      if($('.detail-carousel').length) {

        $('.detail-carousel').imagesLoaded( function() {
          initOwl();
        });

      }

      if($('.detail-timeline').length)  {
        loadTimelineJs();
      }

      $('.detail-overlay').addClass('active');
    }
  });
}

var getUrlParameter = function(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
}

var removeParam = function (parameter) {
  var url=document.location.href;
  var urlparts= url.split('?');

 if (urlparts.length>=2)
 {
  var urlBase=urlparts.shift();
  var queryString=urlparts.join("?");

  var prefix = encodeURIComponent(parameter)+'=';
  var pars = queryString.split(/[&;]/g);
  for (var i= pars.length; i-->0;)
      if (pars[i].lastIndexOf(prefix, 0)!==-1)
          pars.splice(i, 1);
  url = urlBase+'?'+pars.join('&');
  window.history.replaceState('',document.title,url); // added this line to push the new url directly to url bar .

}
return url;
}

$(document).ready(function () {

  var detailParam = getUrlParameter('detail');

  if (detailParam) {
    loadDetail(detailParam);
  }


 $(document).on("click", '.detail-close', function(event) {
      $('.detail-drawer').removeClass('active');
      $('.detail-overlay').removeClass('active');
      removeParam("detail");
  });

  $(document).on("click", '.vert-timeline-balloon', function(event) {
      var data = $(this).closest('.vert-timeline-item').attr('data-detail');
      if($(".template2listing").length) {
        loadDetail(data);
      }
      else {
        var urlExt = get_url_extension( window.location.href );
        var urlToLoad = data + "." + urlExt;
        window.location = urlToLoad;
      }
  });

   $(document).on("click", '.detail-next-button', function(event) {
      var data = $(this).attr('data-detail');
      if($(".template2listing").length) {
        loadDetail(data);
      }
      else {
         var urlExt = get_url_extension( window.location.href );
        var urlToLoad = data + "." + urlExt;
        window.location = urlToLoad;
      }
  });


  $(document).on("click", function(e) {
    if($('.detail-overlay').hasClass('active')){
       $('.detail-drawer').removeClass('active');
      $('.detail-overlay').removeClass('active');
      removeParam("detail");
    }

  });
  
  
   $(document).on("click", '.fancybox__container', function(e) {
    e.stopPropagation();
  });

  $(document).on("click", '.detail-drawer', function(e) {
    e.stopPropagation();
  });

  if($('.template2detail').length && $('.detail-carousel').length) {
    initOwl();
  }

  if($('.homepage .owlStoriesEachRow').length){
    var featuredOwl = $('.homepage .owlStoriesEachRow');

    var homepgeInitOwl = function() {
      if(minLG){
        var winWidth = $( window ).width();
        var gridMaxWidth = 1280;
        var customPadding = winWidth - gridMaxWidth ;
        if(customPadding > 0) {
            customPadding = customPadding / 2 + 20;
        }
        else {
          customPadding = 20;
        }
        //console.log(customPadding);
      }

      featuredOwl.owlCarousel({
        stagePadding: 0,
        margin: 15,
        items: 1,
        loop: false,
        nav: true,
        dots: true,
        dotsEach: false,
        touchDrag: true,
        responsive: {
          321 : {
            stagePadding: 20,
            items: 1
          },
          768 : {
            stagePadding: 20,
            items: 2,
            dots: true,
          },
          1280 : {
            stagePadding: customPadding,
            items: 2,
            dots: false,
          }
        }
      });
    }

    homepgeInitOwl();

    var prevWinWidth = window.innerWidth;
    $(window).on('resize', function() {
      if (window.innerWidth !== prevWinWidth) {
        featuredOwl.trigger('destroy.owl.carousel');
        homepgeInitOwl();
      }
    });
  }

  if($('.home-gallery .owl-carousel').length){
    var homeGalleryCarousel = $('.home-gallery .owl-carousel');

    homeGalleryCarousel.owlCarousel({
      loop: true,
      nav: false,
      dots: false,
      responsive:{
        0:{
          items: 1,
          margin: 14,
        },
        400:{ //768
          items: 2,
          margin: 14,
        },
        900: {
          item: 3,
          margin: 20,
        },
        1280:{
          items: 4,
          margin: 20,
        }
      }
    })
  }

  if($('.home-hero .owl-carousel').length){
    var homeHeroCarousel = $('.home-hero .owl-carousel');

    homeHeroCarousel.owlCarousel({
      margin: 0,
      items: 1,
      loop: false,
      nav: false,
      dots: false,
      onTranslate: function (e) {
        $(e.target).addClass('translating');
      },
      onTranslated: function (e) {
        if(0 < e.item.index){
          $('.home-hero__left').removeClass('home-hero__left--hidden');
        } else {
          $('.home-hero__left').addClass('home-hero__left--hidden');
        }

        if(e.item.index < e.item.count - 1){
          $('.home-hero__right').removeClass('home-hero__right--hidden');
        } else {
          $('.home-hero__right').addClass('home-hero__right--hidden');
        }

        $(e.target).removeClass('translating');
      },
      responsive:{
        0: {
          dots: true
        },
        768: {
          dots: false,
          dotsEach: false,
          mouseDrag: false,
          touchDrag: false,
        }
      }
    })

    $('.home-hero__left').click(function () {
      homeHeroCarousel.trigger('prev.owl.carousel', [700]);
    })
    
    $('.home-hero__right').click(function () {
      homeHeroCarousel.trigger('next.owl.carousel', [700]);
    })

    const cursorRounded = document.querySelector('.home-hero__cursor-round');
    const cursorArrow = document.querySelector('.home-hero__cursor-arrow');

    
    $('.home-hero').mousemove(function(e){
      const mouseY = e.clientY;
      const mouseX = e.clientX;
        
      const w = cursorRounded.offsetWidth;
      const t = cursorRounded.offsetTop;
      const x = parseInt(mouseX - w / 2);
      const y = parseInt(mouseY - w / 2 - t);

      const wA = cursorArrow.offsetWidth;
      const hA = cursorArrow.offsetHeight;
      const tA = cursorArrow.offsetTop;
      const xA = parseInt(mouseX - wA / 2 -  w / 2);
      const yA = parseInt(mouseY - hA / 2 - tA);

      cursorRounded.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      cursorArrow.style.transform = `translate3d(${xA}px, ${yA}px, 0)`;
    })

    $('.home-hero__left, .home-hero__right').mouseout(function(e){
      $('.home-hero__cursor-arrow').addClass('home-hero__cursor-arrow-hidden');
    });

    $('.home-hero__left').mousemove(function(e){
      $('.home-hero__cursor-arrow').removeClass('home-hero__cursor-arrow-hidden');
      $('.home-hero__cursor-arrow').addClass('home-hero__cursor-arrow-rotate');
    });
    
    $('.home-hero__right').mousemove(function(e){
      $('.home-hero__cursor-arrow').removeClass('home-hero__cursor-arrow-hidden');
      $('.home-hero__cursor-arrow').removeClass('home-hero__cursor-arrow-rotate');
    });
  }

  if($('#info-card__slider').length){
    $('#info-card__slider').owlCarousel({
      loop: false,
      margin: 10,
      nav: false,
      items: 1
    })
  }

  if($('.bottom-card__slider').length){
    $('.bottom-card__slider').owlCarousel({
      loop: false,
      margin: 10,
      nav: false,
      items: 1
    })
  }

   if($('.template2detail').length && $('.detail-timeline').length)  {
    loadTimelineJs();
   }


  var items = gsap.utils.toArray('.vert-timeline-item');

  items.forEach(function(item, index) {


          if (maxSM()){
            var xMediaFrom = -50;
            var xBalloonFrom = 50;
          }
          else {
             //check if odd or even item
             if (index  % 2 == 0) {
              var xMediaFrom = -50;
               var xBalloonFrom = 50;
              }
              else {
                var xMediaFrom = 50;
                var xBalloonFrom = -50;
              }
          }




          var media = item.querySelector(".vert-timeline-media");
          var dot = item.querySelector(".vert-timeline-dot");
          var year = item.querySelector(".vert-timeline-year");
          var balloon = item.querySelector(".vert-timeline-balloon");

          gsap.from(media, {
            opacity: 0,
            x: xMediaFrom,
            ease: "power1.inOut",
            duration: 0.5,
            scrollTrigger: {
              scroller: document.getElementsByClassName('vert-timeline-scrollwrap'),
              trigger: media,
              start: "top 80%"
            }
          });

          gsap.from(dot, {
              scale: 3,
              opacity: 0,
              ease: "power1.inOut",
              duration: 0.3,
              scrollTrigger: {
                scroller: document.getElementsByClassName('vert-timeline-scrollwrap'),
                trigger: item,
                start: "top 80%"
              }
            });

           gsap.from(year, {
              scale: 3,
              opacity: 0,
              ease: "power1.inOut",
              duration: 0.3,
              scrollTrigger: {
                scroller: document.getElementsByClassName('vert-timeline-scrollwrap'),
                trigger: item,
                start: "top 80%"
              }
            });

            gsap.from(balloon, {
              opacity: 0,
              scale:0,
              x: xBalloonFrom,
              ease: "power1.inOut",
              duration: 0.5,
              scrollTrigger: {
                scroller: document.getElementsByClassName('vert-timeline-scrollwrap'),
                trigger: item,
                start: "top 80%"
              }
            });

            if (media.querySelector("video") !== null) {
               var video = media.querySelector("video");
               ScrollTrigger.create({
                  trigger: video,
                  scroller: document.getElementsByClassName('vert-timeline-scrollwrap'),
                  start: 'top bottom',
                  end: 'bottom top',
                  onLeave: () => video.pause(),
                  onLeaveBack: () => video.pause(),
                });

            }



    });
});
