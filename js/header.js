$(document).ready(function() {

  if ($('#template0').length) { //milestones page
    $('html').addClass('noScroll');
  }

  $('html').addClass('ready');
  $('.header .logoWrap .burgBtnWrap').on('click', function(){
    if ($('.header').hasClass('menuOpen')) {
      $('.header').removeClass('menuOpen');
      $('.navMenu').removeClass("activeNav");

       if (!$('#template0').length) { //not milestones page
         startScroll();
       }

    } else {
      $('.header').addClass('menuOpen');

      if (!$('#template0').length) { //not milestones page
         stopScroll();
       }

      $('.navMenu').addClass("activeNav");
    }
  });
  // STOP START SCROLL
  ////////////////////////////////////////////////
  var leftoffsetY;
  var scrollStop = $('html').hasClass('noScroll');
  function preventDefault(e){
    e.preventDefault();
  }
  function stopScroll() {
    if (!scrollStop) {
      // document.body.addEventListener('touchmove', preventDefault);
      leftoffsetY = window.pageYOffset;
      var topY = -leftoffsetY + 'px';
      $('html').addClass('noScroll');
      console.log(topY);
      $('body').css({
        'top': topY
      });
      scrollStop = true;

    }
  }

  function startScroll() {
    if (scrollStop) {
      // document.body.removeEventListener('touchmove', preventDefault);
      $('html').removeClass('noScroll');
      window.scrollTo(0, leftoffsetY);
      // $('html, body').scrollTop(leftoffsetY);
      scrollStop = false;

    }
  }

  $('.nav-trigger').on('click', function() {
    if ($('.burger').hasClass('menu-on')) {
      $('.burger').removeClass('menu-on');
      $('.main-menu').removeClass("active");

    } else {
      $('.burger').addClass('menu-on');
      $('.main-menu').addClass("active");

    }
  });

  // $('.has-children').on('click', function() {
  //
  //   var winWidth = $(window).width();
  //   if (winWidth >= 1280) {
  //     if ($(this).hasClass('menu-on')) {
  //       // $(this).removeClass('menu-on');
  //     } else {
  //       console.log(winWidth);
  //       $(this).addClass('menu-on');
  //     }
  //   }
  // });

  $('.hasChild').on('click', function(){
    var winWidth = $(window).width();
    if(winWidth >= 1280){
      console.log($(this));
      if ($(this).hasClass('menu-on')) {
        $(".dropdown", this).removeClass('menu-on');
      } else {
        $(this).toggleClass("activeChild");
        $(".dropdown", this).addClass('menu-on');
        $(".dropdown", this).toggle();
      }
    }
  });

  $('.mobHasChild').on('click', function(){
    if ($(this).hasClass('menu-on')) {
      $(".dropdown", this).removeClass('menu-on');
    } else {
      $(this).toggleClass("activeChild");
      $(".dropdown", this).addClass('menu-on');
      $(".dropdown", this).toggle();
    }
  });


  $(document).on("mouseleave", '.hasChild .menu-on', function(e) {
    if ($(this).hasClass('menu-on')) {
      $(this).removeClass('menu-on');
      $(this).parent().toggleClass("activeChild");
      $(this).css('display', 'none');
    }
  });


  // open search menu
  $('header .searchBtn').on('click', function(){
    if(!$('header .searchBar').hasClass('opened')) {
      $('header .searchBar').addClass('opened')
      $('.searchBar input').focus().val("");
    }
  });

  // close search menu
  $('header .closeSearchBar').on('click', function(){
    if($('header .searchBar').hasClass('opened')) {
      $('header .searchBar').removeClass('opened')
    }
  });

  $(document).on("click", '.searchBar', function(e) {
    if(e.target.id != 'tipue_search_input'){
      $('header .searchBar').removeClass('opened')
    }else{
      // console.log('not equal');
    }

  });

  // $(document).on("mouseleave", '.main-menu ul li.has-children.menu-on ul', function(e) {
  //   if ($(this).closest('li.has-children').hasClass('menu-on')) {
  //     $(this).closest('li.has-children').removeClass('menu-on')
  //   }
  // });


  if ($('.layout-search').length) {
    console.log('xx');
    searchQuery = getUrlParameter('q');

    if (searchQuery != null && searchQuery != true && searchQuery != '') {

      console.log(searchQuery.replace(/\+/g, ' '));

      $('.layout-search input[type=text]').val(searchQuery.replace(/\+/g, ' ').replace(/\,/g, ' ').replace(/\./g, ' '));
    }

    $('#tipue_search_input').tipuesearch({
        mode: 'live',
        show: 20,
        showURL: true,
        highlightTerms: true,
        showTitleCount: true,
        descriptiveWords: 50,
        'contextBuffer' : false,
        showRelated: false,
        liveDescription: 'section'
    });

    //update counts no.
    if ($('#tipue_search_results_count').length) {
      var resultNo = $('#tipue_search_results_count').html().split('result');
      message = '<h3 class="s">' + resultNo[0] + ' <span>results</span>' + '</h3>';
      $('#tipue_search_results_count').html(message);
    }
  }

  //================================ append SP user title to stories URL and body tag for tracking ======================

    function removeTrailingSlash(str) {
      return str.replace(/\/+$/, '');
    }

    function string_to_slug (str) {
      str = str.replace(/^\s+|\s+$/g, ''); // trim
      str = str.toLowerCase();

      // remove accents, swap ñ for n, etc
      var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
      var to   = "aaaaeeeeiiiioooouuuunc------";
      for (var i=0, l=from.length ; i<l ; i++) {
          str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
      }

      str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
          .replace(/\s+/g, '-') // collapse whitespace and replace by -
          .replace(/-+/g, '-'); // collapse dashes

      return str;
    }

    var slug ="development-test-name";

    /*TO INCLUDE IN LIVE SHAREPOINT ENVIRONMENT
    var getUrlPath = removeTrailingSlash(document.querySelector('link[rel="basepath"]').href);

    sprLib.baseUrl(getUrlPath);
    sprLib.user().info().then(function (objUser) {
    if (objUser.Title) {
        slug = string_to_slug(objUser.Title);
    }
    else {
        slug ="unknown-user";
    }
    TO INCLUDE IN LIVE SHAREPOINT ENVIRONMENT*/

    var storiesLinks = document.querySelectorAll(".storiesLayout a.eaListItem");

    storiesLinks.forEach(function(storyLink) {
      if (storyLink.href.indexOf('?') != -1 && storyLink.href.indexOf('dbs1bank.sharepoint.com') != -1) {
          storyLink.href += '&spuser=' + slug;
      }
    });

  document.querySelector("body").setAttribute('data-user', slug);

});
