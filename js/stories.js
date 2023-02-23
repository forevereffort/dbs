// ========================================================================================================================
// my set Up
//Safari Back Reload
window.onpageshow = function(event) {if (event.persisted) {window.location.reload();}};
//Detect Responsive
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
// end my Set Up

$(document).ready(function() {
  init();
});

var featuredOwl = $('.owlStoriesEachRow');

var initOwl = function() {

    if($('.owlStoriesEachRow').length){

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


function init(){

  NiceSelect.bind(document.getElementById("tags"), {
  	searchable: false
  });
  var nicetheme = NiceSelect.bind(document.getElementById("themes"), {
  	searchable: false
  });

  initOwl();

  $('.dyTitle').on('mousedown', function(e) {
     e.preventDefault();
     this.blur();
     window.focus();
  });


  // if($('.mobFilter').length){
  //   $(".mobFilter").on('click', function() {
  //     console.log('togg');
  //     $('.mobFilter li .filter-group').toggleClass('flip');
  //   });
  // };

  //get url parameter e.g. stories.html?theme=theme-name
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

  var removeParam = function() {
    var url = document.location.href;
    var urlparts = url.split('?');
    var baseUrl = urlparts[0];
    // console.log(urlparts[0]);
    window.history.replaceState('', document.title, baseUrl); // added this line to push the new url directly to url bar .
    // if (urlparts.length >= 2) {
    //   var urlBase = urlparts.shift();
    //   var queryString = urlparts.join("?");
    //
    //   var prefix = encodeURIComponent(parameter) + '=';
    //   var pars = queryString.split(/[&;]/g);
    //   for (var i = pars.length; i-- > 0;)
    //     if (pars[i].lastIndexOf(prefix, 0) !== -1)
    //       pars.splice(i, 1);
    //   url = urlBase + '?' + pars.join('&');
    //   window.history.replaceState('', document.title, url); // added this line to push the new url directly to url bar .
    //
    // }
    return baseUrl;
  }



  // var options = { // filter with markets group
  //   valueNames: [
  //     'themes',
  //     'tags',
  //     'markets',
  //     'title'
  //   ],
  //   page: 24,
  //   pagination: true
  // };

  var options = {
    valueNames: [
      'themes',
      'tags',
      'title'
    ],
    page: 24,
    pagination: true
  };
  var userList = new List('list', options);

  function filter() {
    var tagSelected = $("select.selectTags option:selected").attr('data-filter');
    var themeSelected = $("select.selectThemes option:selected").attr('data-filter');
    // console.log(themeSelected);
    userList.filter(function(item) {
      var tagFilter = false;
      var themesFilter = false;

      if (tagSelected == "all") {
        tagFilter = true;
      } else {
        // console.log(item.values().tags);
        tagFilter = item.values().tags.includes(tagSelected);
        // tagFilter = item.values().tags.indexOf(tagSelected) >= 0;
        // console.log(tagFilter);
      }

      if (themeSelected == "all") {
        themesFilter = true;
        // console.log('true');
      } else {
        themesFilter = item.values().themes.includes(themeSelected);
      }

      return tagFilter && themesFilter
    });
    userList.update();
  }


  var preFilterStories = function(navSelectedTheme) {
     //do stories filtering based on navSelectedTheme
     userList.filter(function(item) {
       if (item.values().themes.includes(navSelectedTheme)) {
         return true;
       } else {
         return false;
       }
     });
     return false;
  };
  // console.log(navSelectedTheme);
  var navSelectedTheme = getUrlParameter('theme');

  if(!navSelectedTheme){
    console.log('false');
  }else{
    console.log('true');
    console.log(navSelectedTheme);
    preFilterStories(navSelectedTheme);
    nicetheme.update(navSelectedTheme);
    var droptext = $('.nslist li[data-value*='+ navSelectedTheme + ']').text();
    $('.selectThemes span.current').text(droptext);
    $('.dyTitle').val(navSelectedTheme);
  }

  //set active theme state based on url
  function setActiveTheme(parameter){
    $(`.navItem a[href*='stories.html?theme=`+parameter+`#list']`).addClass("activeTheme");
  }
  if($('.storiesPage').length){
    setActiveTheme(navSelectedTheme);
  };



  $(function() {
    //updateList();
    $("select.selectTags").on('change', function() {
      filter();
    });
    $("select.selectThemes").on('change', function() {
      filter();
      var changeTitleTheme = $("select.selectThemes option:selected").val();
      // console.log(changeTitleTheme);
      $('.dyTitle').val(changeTitleTheme);
      if ( changeTitleTheme == 'all-themes' ) {
          //remove browser url theme parameter
         removeParam();
         $(`.navItem .themesDrop a`).removeClass("activeTheme");
       }else{
         //replace blower url theme parameter
        window.history.replaceState("", "", `?theme=` + changeTitleTheme + `#list`);
        if($(`.navItem .themesDrop a`).hasClass("activeTheme")){
          $(`.navItem .themesDrop a`).removeClass("activeTheme");
          $(`.navItem .themesDrop a[href*='stories.html?theme=`+changeTitleTheme+`#list']`).addClass("activeTheme");
        }
        setActiveTheme(changeTitleTheme);
       }

    });
    userList.on('updated', function(list) {
      if (list.matchingItems.length > 0) {
        $('.no-result').hide()
      } else {
        $('.no-result').show()
      }
    });
    // $("#keywordSearch").on("keyup", function() {
    //   // filter();
    //
    // });

  });




//=================================== end ===========================================
};

var prevWinWidth = window.innerWidth;
$(window).on('resize', function() {
  if (window.innerWidth !== prevWinWidth) {
    featuredOwl.trigger('destroy.owl.carousel');
    initOwl();
  }
});
