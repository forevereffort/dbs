// ========================================================================================================================
// my set Up
//Safari Back Reload
window.onpageshow = function (event) {
  if (event.persisted) {
    // window.location.reload();
    $("body").addClass("ready");
  }
};

//Detect Responsive
function smartDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function isIos() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function ie() {
  if (document.documentMode || /Edge/.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
}

function minXS() {
  return Modernizr.mq("(min-width: 0px)");
}

function minSM() {
  return Modernizr.mq("(min-width: 321px)");
}

function minMD() {
  // return Modernizr.mq('(min-width: 426px)');
  return Modernizr.mq("(min-width: 641px)");
}

function minMDLG() {
  return Modernizr.mq("(min-width: 835px)");
}

function minLG() {
  return Modernizr.mq("(min-width: 1281px)");
}

function minXL() {
  return Modernizr.mq("(min-width: 1441px)");
}

function minXXL() {
  return Modernizr.mq("(min-width: 1601px)");
}

function maxXS() {
  return Modernizr.mq("(max-width: 320px)");
}

function maxSM() {
  // return Modernizr.mq('(max-width: 425px)');
  return Modernizr.mq("(max-width: 640px)");
}

function maxMD() {
  return Modernizr.mq("(max-width: 834px)");
}

function maxMDLG() {
  return Modernizr.mq("(max-width: 1280px)");
}

function maxLG() {
  return Modernizr.mq("(max-width: 1440px)");
}

CustomEase.create("cubic_bezier", "0.4, 0, 0.2, 1");

// end my Set Up
// ========================================================================================================================

$(document).ready(function () {
  // barba
  var ajaxPageOverflowWrapperScrollTop;

  barba.init({
    // debug: true,
    timeout: 10000,
    requestError: (trigger, action, url, response) => {
      console.log(response);
    },
    // stop user from clicking links while transition
    preventRunning: true,
    prevent: function ({ el }) {
      // prevent all links except those for ajax overlay by using class name barbaBtn
      return !el.classList.contains("barbaBtn");
    },
    transitions: [
      // overlay transition
      {
        sync: false,
        name: "custom-overlay",
        from: {
          // define a custom rule based on the trigger class
          custom: ({ trigger }) => {
            return trigger.classList && trigger.classList.contains("barbaBtn");
          },
        },
        to: { namespace: ["single-ajax-page"] },
        leave(data) {
          var prevUrl = data.current.url.href;
          let ajaxPanelOverlayHtml =
            '<div id="module-ajaxPanelOverlay" data-backHref=' +
            prevUrl +
            "></div>";
          $('body[data-barba="wrapper"]').prepend(ajaxPanelOverlayHtml);

          return gsap.from("#module-ajaxPanelOverlay", 0.6, {
            opacity: 0,
            ease: "Power4.easeOut",
          });
        },
        enter(data) {},
        after(data) {
          var $nextContainer = $(data.next.container);
          var $currentContainer = $(data.current.container);

          // append overlay
          let overlayHtml =
            '\
            <div class="topPanelWrap">\
              <div class="g noMaxWidth">\
                <div class="r">\
                  <div class="md-10 md-offset-2">\
                    <div class="topPanel">\
                      <div class="g noMaxWidth">\
                        <div class="r">\
                          <div class="mdlg-12">\
                            <div class="wrap">\
                              <h3 class="semi closeOverlayBtn">\
                                <a>\
                                  close\
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.678 17.678">\
                                    <g id="Group_36235" data-name="Group 36235" transform="translate(7216.027 12192.197)">\
                                      <line id="Line_3" data-name="Line 3" y2="24" transform="translate(-7198.703 -12174.873) rotate(135)" fill="none" stroke="#000" stroke-width="1"/>\
                                      <line id="Line_3-2" data-name="Line 3" y2="24" transform="translate(-7215.674 -12174.873) rotate(-135)" fill="none" stroke="#000" stroke-width="1"/>\
                                    </g>\
                                  </svg>\
                                </a>\
                              </h3>\
                            </div>\
                          </div>\
                        </div>\
                      </div>\
                    </div>\
                  </div>\
                </div>\
              </div>\
            </div>\
            <div class="whiteBg">\
              <div class="g noMaxWidth">\
                <div class="r">\
                  <div class="md-10 md-offset-2">\
                    <div class="bg"></div>\
                  </div>\
                </div>\
              </div>\
            </div>\
            <div class="ajaxPageOverflowWrapper">\
              <div class="g noMaxWidth">\
                <div class="r">\
                  <div class="md-10 md-offset-2">\
                    ' +
            $nextContainer.find("main .singleBodyAjaxContents")[0].outerHTML +
            "\
                  </div>\
                </div>\
              </div>\
            </div>\
          ";
          $("#module-ajaxPanelOverlay").html(overlayHtml);
          // clear next (single-ajax-page) container after getting it's contents. *need to keep the container to prevent barba transition not found error.
          $nextContainer.empty();

          // // re append previous container back as it was into body
          $($currentContainer).insertAfter("#module-ajaxPanelOverlay");
          $(window).scrollTop(barba.history.current.scroll.y);

          // animate slide in
          var tl = gsap.timeline({
            onComplete: function () {},
          });
          tl.from(
            "#module-ajaxPanelOverlay .whiteBg, #module-ajaxPanelOverlay .topPanelWrap, #module-ajaxPanelOverlay .ajaxPageOverflowWrapper",
            { x: "100%", duration: 1, ease: "Power4.easeOut" }
          );

          initOnAfter();
        },
      },

      // close overlay transition
      {
        sync: true,
        name: "custom-overlay-close",
        from: {
          // define a custom rule based on the trigger class
          custom: ({ current }) => {
            let parser = new DOMParser();
            let currentPageDom = parser.parseFromString(
              current.html,
              "text/html"
            );
            return $(currentPageDom).find("#module-ajaxPanelOverlay").length;
          },
          namespace: ["single-ajax-page"],
        },
        leave(data) {
          $("#module-ajaxPanelOverlay").addClass("closingOverlay");
          ajaxPageOverflowWrapperScrollTop = $(
            "#module-ajaxPanelOverlay .ajaxPageOverflowWrapper"
          ).scrollTop();
          $('div[data-barba-namespace="single-ajax-page"]').remove();
        },
        enter(data) {},
        after(data) {
          // set previous scroll pos
          $(window).scrollTop(barba.history.current.scroll.y);

          // // re append previous container back as it was into body
          $(data.current.container).insertAfter($("#module-ajaxPanelOverlay"));
          $(window).scrollTop(barba.history.current.scroll.y);
          data.next.container.remove();

          // make sure overflow doesnt scroll to top when transiting
          $("#module-ajaxPanelOverlay .ajaxPageOverflowWrapper").scrollTop(
            ajaxPageOverflowWrapperScrollTop
          );
          // animate slide out
          var tl = gsap.timeline({
            onComplete: function () {
              $("#module-ajaxPanelOverlay").remove();
            },
          });
          tl.to(
            "#module-ajaxPanelOverlay .whiteBg, #module-ajaxPanelOverlay .topPanelWrap, #module-ajaxPanelOverlay .ajaxPageOverflowWrapper",
            { x: "100%", duration: 0.7, ease: "Power4.easeInOut" }
          );
          tl.to(
            "#module-ajaxPanelOverlay",
            { opacity: 0, duration: 0.5, ease: "Power4.easeInOut" },
            "-=0.3"
          );

          initOnAfter();
        },
      },
    ],
  });

  barba.hooks.before((data) => {
    // disable all scroll trigger to prevent animation jump while transiting pages
    let triggers = ScrollTrigger.getAll();
    triggers.forEach((trigger) => {
      trigger.disable(false);
    });
  });

  barba.hooks.enter((data) => {
    // kill all scroll trigger to reset
    let triggers = ScrollTrigger.getAll();
    triggers.forEach((trigger) => {
      trigger.kill(true);
    });
  });

  initOnAfter();

  $("body").addClass("ready");

  $(".mapBtn").on("click", function (event) {
    event.preventDefault();
    var map = new Fancybox([
      {
        src: '<div class="mapWrapper"> <img src="files/media/esplanade_directory_map_large.jpg"> <h2 class="s semi">Getting here</h2> <p>If you are coming from the Esplanade Mall, look out for Harrys @ Esplanade / Mischief located at Level 1. Head towards the restaurants and exit to the open space nearby along the waterfront, where the DBS Foundation Outdoor Theatre is located!</p> <p><b>Address:</b> 1 Esplanade Drive, Singapore 038981</p> <p><u><strong>Via Public Transport</strong></u><br> Alight at either bus stops 02061 (The Esplanade) or 02111 (Esplanade Bridge) and walk towards the Esplanade Mall.<br> Alternatively, you can alight at Esplanade MRT station or City Hall MRT station and follow the signboards at the underpass towards the Esplanade.<u></u><br> <br> <u><strong>Via Taxi</strong></u><br> Taxi stand: C24 Esplanade Mall, 8 Raffles Avenue, Singapore 039802. The taxi stand is right outside the Esplanade Mall.<br> <br> <u><strong>Via Car</strong></u><br> Parking is available at the Esplanade Mall 24h daily.</p> </div>',
        type: "html",
      },
    ]);
    //console.log("map");
    return false;
  });

  $(".header-menu__btn").on("click", function () {
    if ($(this).hasClass("is-open")) {
      $(this).removeClass("is-open");
      $(".header-menu").removeClass("is-open");
    } else {
      $(this).addClass("is-open");
      $(".header-menu").addClass("is-open");
    }
  });

  $(".events__header-btn").on("click", function () {
    if ($(".events__header").hasClass("events__header--expand")) {
      $(".events__header").removeClass("events__header--expand");
      $(this).removeClass("active");
      $(".events__header-filter").slideUp();
      $(".events__header-btn-text span:eq(0)").text("Show");
    } else {
      $(".events__header").addClass("events__header--expand");
      $(this).addClass("active");
      $(".events__header-filter").slideDown();
      $(".events__header-btn-text span:eq(0)").text("Hide");
    }
  });

  if ($("#events-section").length) {
    var arrFilter = [];

    function convertDateFormat(dateString) {
      const [year, month] = dateString.split("-");
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthName = months[parseInt(month, 10) - 1];
      const formattedDate = `${monthName} ${year}`;
      return formattedDate;
    }

    $(".eachListing h2[data-date]").each(function () {
      rawDate = $(this).data("date");
      //console.log(rawDate);

      if ($.inArray(rawDate, arrFilter) == -1) {
        arrFilter.push(rawDate);
        //console.log(arrFilter);
      }
    });

    arrFilter.forEach((rawDate) => {
      var niceDate = convertDateFormat(rawDate);

      var toAppend =
        '<div class="events__header-filter-month-col">\
                        <div class="events__header-filter-month-item" data-date="' +
        rawDate +
        '">' +
        niceDate +
        "</div>\
                      </div>";

      $(".events__header-filter-month-row").append(toAppend);
    });

    var showResults = true;

    var eventsList = new List("events-section", {
      valueNames: ["title-1", "title-2", "txt", "txt-1"],
      page: 9,
      pagination: true,
    })
      .on("updated", function () {
        //console.log("updated status " + showResults);

        if (showResults == true) {
          $(".events_list > .g > h2").removeClass("hide");
        } else {
          $(".events_list > .g > h2").addClass("hide");
        }

        if ($(".events_list .list li").length > 0) {
          //$('.events_list > .g > h2').addClass('hide');
          var resultCount = $(".events_list .list li").length;
          $(".events_list > .g > h2").text(
            "Showing " + resultCount + " filtered result(s)"
          );
        } else {
          //$('.events_list > .g > h2').removeClass('hide');
          $(".events_list > .g > h2").text("No results found.");
        }

        if ($(".events_list .pagination li").length > 1) {
          $(".events_list .pagination li").removeClass("hide");
        } else {
          $(".events_list .pagination li").addClass("hide");
        }
      })
      .on("filterComplete", function () {
        if (eventsList.size() / eventsList.page <= 1) {
          $(".pagination li").css("display", "none");
        }

        //console.log("filter complete status " + showResults);

        if (showResults == true) {
          $(".events_list > .g > h2").removeClass("hide");
        } else {
          $(".events_list > .g > h2").addClass("hide");
        }

        if ($(".events_list .list li").length > 0) {
          var resultCount = $(".events_list .list li").length;
          $(".events_list > .g > h2").text(
            "Showing " + resultCount + " filtered result(s)"
          );
        } else {
          $(".events_list > .g > h2").text("No results found.");
        }

        if ($(".events_list .pagination li").length > 1) {
          $(".events_list .pagination li").removeClass("hide");
        } else {
          $(".events_list .pagination li").addClass("hide");
        }
      })
      .on("searchComplete", function () {
        if (eventsList.size() / eventsList.page <= 1) {
          $(".pagination li").css("display", "none");
        }
      });

    $(".search").on("input", function () {
      if (
        $(this).val().length == 0 &&
        $(".events__header-filter-month-item.active").length == 0
      ) {
        showResults = false;
      } else {
        showResults = true;
      }

      if (showResults == true) {
        $(".events_list > .g > h2").removeClass("hide");
      } else {
        $(".events_list > .g > h2").addClass("hide");
      }
    });

    if (eventsList.size() / eventsList.page <= 1) {
      $(".pagination li").css("display", "none");
    }

    $(".events__header-filter-month-item").on("click", function () {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
      } else {
        $(this).addClass("active");
      }

      if ($(".events__header-filter-month-item.active").length > 0) {
        var d = [];

        showResults = true;

        $(".events__header-filter-month-item.active").each(function (
          index,
          item
        ) {
          d.push($(item).attr("data-date"));
        });

        eventsList.filter(function (item) {
          if (d.includes($(".topRow .s", item.elm).attr("data-date"))) {
            return true;
          }

          return false;
        });
      } else {
        console.log("my test");

        if ($(".search").val().length == 0) {
          showResults = false;
        } else {
          showResults = true;
        }

        eventsList.filter();
      }
    });
  }

  function loadGallery(slug) {
    var filePath = "json/album-" + slug + ".json";
    console.log(filePath);
    $.getJSON(filePath, function (data) {
      //console.log(data);

      $('a[data-photogallery="' + slug + '"]').on("click", function () {
        var gallery = new Fancybox(data, {
          hideScrollbar: false,
        });

        return false;
      });
    });
  }

  if ($(".widget-imgGallery").length) {
    $("a[data-photogallery]").each(function (index) {
      console.log("test");
      var slug = $(this).data("photogallery");
      loadGallery(slug);
    });
  }

  if ($("#stories-section").length) {
    const tagQueryString = window.location.search;
    const urlTagParams = new URLSearchParams(tagQueryString);
    const urlTagList = urlTagParams.getAll('tag');

    //load stories json
    function getStoryCardHtml(item) {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      htmlStr = "";
      const [y, m, d] = item.date.split("-");

      htmlStr += "<li class='" + item.width + "'>";
      htmlStr += '<div class="story-card">';
      htmlStr += '<a href="' + item.full_article_url + '"><img src="' + item.image_file_name + '" /></a>';
      htmlStr += '<ul class="story-card__meta">';
      if (item.new) {
        htmlStr += '<li class="story-card__meta-tag"><span>NEW</span></li>';
      }
      htmlStr +=
        '<li class="story-card__meta-date"><p>' +
        d +
        " " +
        months[parseInt(m, 10) - 1] +
        " " +
        y +
        "</p></li>";
      htmlStr += "<li><p>" + item.min_read + " min read</p></li>";
      htmlStr += "</ul>";
      htmlStr += '<h2 class="s"><a class="title" href="' + item.full_article_url + '">' + item.title + "</a></h2>";
      htmlStr += "<p class='des'>" + item.description + "</p>";
      htmlStr += '<div class="story-card__tags">';
      firstCheck = true;
      for (tag of item.tags) {
        if (!firstCheck) {
          htmlStr += ", ";
        }
        htmlStr += '<span>' + tag + "</span>";
        firstCheck = false;
      }
      htmlStr += "</div>";
      htmlStr += "</div>";
      htmlStr += "</li>";

      return htmlStr;
    }

    $.ajax({
      async: false,
      url: "json/stories.json",
      dataType: "json",
      success: function (data) {
        popularList = data.filter((item) => item.popular);
        htmlStr = "";
        var arrUniqueTags = [];

        for (item of data) {
          htmlStr += getStoryCardHtml(item);

          for (tag of item.tags) {
            if ($.inArray(tag, arrUniqueTags) == -1) {
              arrUniqueTags.push(tag);
            }
          }
        }

        arrUniqueTags.forEach((tag) => {
          var selectedTag = false;

          if( urlTagList.includes(tag) ){
            selectedTag = true;
          }

          var htmlStr = "";
          htmlStr += '<div class="events__header-filter-month-col">';
          htmlStr +=
            '<div class="events__header-filter-month-item ' + (selectedTag ? 'active' : '') + '" data-tag="' +
            tag +
            '">' +
            tag +
            "</div>";
          htmlStr += "</div>";
          $(".events__header-filter-month-row").append(htmlStr);
        });

        $(".stories_list").html(htmlStr);

        var storiesList = new List("stories-section", {
          valueNames: ["title", "des"],
          listClass: "stories_list",
          page: 11,
          pagination: true,
        }).on("updated", function () {
          if ($(".stories_list li").length > 0) {
            $(".events_list > .g > h2").addClass("hide");
            $(".stories-popular").addClass("hide");
          } else {
            $(".events_list > .g > h2").removeClass("hide");
            $(".stories-popular").removeClass("hide");

            randPopular = [...popularList]
              .sort(() => 0.5 - Math.random())
              .slice(0, 4);
            
            htmlStr = "";
            for (rp of randPopular) {
              htmlStr += getStoryCardHtml(rp);
            }

            $(".stories-popular").html(htmlStr);
          }
        });

        if( urlTagList.length > 0 ){
          storiesList.filter(function (item) {
            isExist = false;

            $(".story-card__tags span", item.elm).each(function (i, e) {
              if (urlTagList.includes(e.innerText)) {
                isExist = true;
              }
            });

            return isExist;
          });
        }

        $(".events__header-filter-month-item").on("click", function () {
          if ($(this).hasClass("active")) {
            $(this).removeClass("active");
          } else {
            $(this).addClass("active");
          }

          var urlParam = '';
          
          if ($(".events__header-filter-month-item.active").length > 0) {
            var d = [];

            $(".events__header-filter-month-item.active").each(function (
              index,
              item
            ) {
              tag = $(item).attr("data-tag")
              d.push(tag);

              if( urlParam != '' ){
                urlParam += '&';
              }

              urlParam += 'tag=' + tag;
            });

            storiesList.filter(function (item) {
              isExist = false;

              $(".story-card__tags span", item.elm).each(function (i, e) {
                if (d.includes(e.innerText)) {
                  isExist = true;
                }
              });

              return isExist;
            });
          } else {
            storiesList.filter();
          }

          var url = window.location.href.split('?')[0];
          if( urlParam != '' ){
            url += '?' + urlParam;
          }
          var next_title = 'My new page title';
          var nextState = { additionalInformation: 'Updated the URL with JS' };

          window.history.pushState(nextState, next_title, url);
          window.history.replaceState(nextState, next_title, url);
        });
      },
      error: function (e) {
        var errorMsg = e ? e.status + " " + e.statusText : "";
        alert("json data error");
        console.log(errorMsg);
      },
    });
  }

  if( $('.single-article__slider').length > 0 ){
    $('.single-article__slider--normal .owl-carousel').owlCarousel({
      loop: true,
      margin: 2,
      nav: false,
      dots: false,
      responsive:{
        0:{
          items:1
        },
        768:{
          items:2
        },
        900:{
          items:3
        },
      }
    })

    $.ajax({
      async: false,
      url: "json/stories.json",
      dataType: "json",
      success: function (data) {
        $('.single-article__slider--article .single-article__slider_item').each(function(i, elem){
          sliderHtmlStr = '';
          article_id = parseInt($(elem).attr('data-article-id'));

          articleInfo = data.find( item => item.article_id == article_id)

          if( articleInfo ){
            sliderHtmlStr += '<a href="' + articleInfo.full_article_url + '">';
              sliderHtmlStr += '<img src="' + articleInfo.image_file_name + '">';
            sliderHtmlStr += '</a>';
            sliderHtmlStr += '<h2><a href="' + articleInfo.full_article_url + '">' + articleInfo.title + '</a></h2>';
            sliderHtmlStr += '<p>' + articleInfo.description + '<p>';
          }

          $(elem).html(sliderHtmlStr);
        })

        $('.single-article__slider--article .owl-carousel').owlCarousel({
          loop: true,
          margin: 2,
          nav: false,
          dots: false,
          responsive:{
            0:{
              items:1
            },
            768:{
              items:2
            },
            900:{
              items:3
            },
          }
        })
      },
      error: function (e) {
        var errorMsg = e ? e.status + " " + e.statusText : "";
        alert("json data error");
        console.log(errorMsg);
      },
    });
  }

  if( $('.module-slider').length > 0 ){
    $('.module-slider .owl-carousel').owlCarousel({
      loop: true,
      margin: 0,
      nav: false,
      dots: true,
      items:1
    })
  }
});

// ajax panel rerun conditions
function ajaxRunCondition_onClose() {
  return $("#module-ajaxPanelOverlay.closingOverlay").length;
}

function ajaxRunCondition_doNotRunOnOpen() {
  return (
    $("body > div:not(#module-ajaxPanelOverlay)").length &&
    !$("#module-ajaxPanelOverlay:not(.closingOverlay)").length
  );
}

// initOnAfter
// ======================================================================
// ======================================================================
// ======================================================================
function initOnAfter(data) {
  // change scroller so scrollttrigger works in overflow container
  if ($("#module-ajaxPanelOverlay:not(.closingOverlay)").length) {
    ScrollTrigger.defaults({
      scroller: "#module-ajaxPanelOverlay .ajaxPageOverflowWrapper",
    });
  } else {
    ScrollTrigger.defaults({
      scroller: "",
    });
  }

  //pin left column image on ajax pages
  if ($(".pin").length && minMD()) {
    // change scroller so scrollttrigger works in overflow container
    if ($("#module-ajaxPanelOverlay:not(.closingOverlay)").length) {
      ScrollTrigger.create({
        trigger: ".col-right",
        pin: ".pin",
        start: "top top+=50px",
        end: "bottom bottom",
        invalidateOnRefresh: true,
      });
    } else {
      ScrollTrigger.create({
        trigger: ".col-right",
        pin: ".pin",
        start: "top top+=60px",
        end: "bottom bottom",
        invalidateOnRefresh: true,
      });
    }
  }

  // replace social share url
  $(".socialSharePageBtn").each(function (i, el) {
    var pageUrl = window.location.href;
    var socialPath;

    if ($(el).hasClass("socialSharePageBtn-facebook")) {
      socialPath = "https://www.facebook.com/sharer.php?u=" + pageUrl + "";
      $(el).attr("href", socialPath);
    }

    if ($(el).hasClass("socialSharePageBtn-twitter")) {
      socialPath = "https://twitter.com/intent/tweet?url=" + pageUrl + "";
      $(el).attr("href", socialPath);
    }

    if ($(el).hasClass("socialSharePageBtn-linkedin")) {
      socialPath =
        "https://www.linkedin.com/sharing/share-offsite/?url=" + pageUrl + "";
      $(el).attr("href", socialPath);
    }

    if ($(el).hasClass("socialSharePageBtn-whatsapp")) {
      metaDesc = $('meta[name="description"]').attr("content");
      socialPath =
        "https://api.whatsapp.com/send?text=" +
        encodeURIComponent(metaDesc) +
        "%0a%0a" +
        encodeURIComponent(pageUrl);
      $(el).attr("href", socialPath);
    }

    if ($(el).hasClass("socialSharePageBtn-telegram")) {
      metaDesc = $('meta[name="description"]').attr("content");
      socialPath =
        "https://t.me/share/url?url=" +
        pageUrl +
        "&text=" +
        encodeURIComponent(metaDesc);
      $(el).attr("href", socialPath);
    }

    if ($(el).hasClass("socialSharePageBtn-copyThisUrl")) {
      socialPath = pageUrl;
      $(el).attr("data-copyThisUrl", socialPath);
    }
  });

  // copy to clip board
  function copyLink(url) {
    var dummy = document.createElement("input"),
      // text = window.location.href;
      text = url;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

  $(".toClipboardBtn").click(function (e) {
    copyLink($(this).attr("data-copyThisUrl"));
  });

  // headers
  if ($("header").length) {
    ScrollTrigger.create({
      trigger: $("body"),
      start: "0%+=100px 0%",
      end: "0%+=100px 0%",
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        if (self.direction == 1) {
          $("header").addClass("scrolled");
        } else {
          $("header").removeClass("scrolled");
        }
      },
    });

    var lastBodyScrollDirection = 1;
    ScrollTrigger.create({
      trigger: $("body"),
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        if (lastBodyScrollDirection != self.direction) {
          if (self.direction == -1) {
            lastBodyScrollDirection = self.direction;
            $("header").addClass("scrolledUp");
          } else {
            lastBodyScrollDirection = self.direction;
            $("header").removeClass("scrolledUp");
          }
        }
      },
    });

    // progresss bar
    function updateProgressBar() {
      var winheight = window.innerHeight;
      var docheight = document.body.clientHeight;
      var scrollTop = $(document).scrollTop();
      var trackLength = docheight - winheight;
      var pctScrolled = Math.floor((scrollTop / trackLength) * 100); // gets percentage scrolled (ie: 80 NaN if tracklength == 0)
      var speed = 0.1;
      gsap.to($(".progressBar .bar"), speed, {
        width: pctScrolled + "%",
        ease: Linear.easeNone,
      });
    }
    $(window).on("scroll", function () {
      updateProgressBar();
    });
    updateProgressBar();
  }

  // in view animations
  if ($("[data-inView]").length) {
    var itemQueue = [];
    var delay = 120;
    var queueTimer;

    function processItemQueue() {
      if (queueTimer) return; // We're already processing the queue
      queueTimer = window.setInterval(function () {
        if (itemQueue.length) {
          thisItemQueue = itemQueue.shift();
          $(thisItemQueue).addClass("inView-activated");

          // for count up
          if ($(thisItemQueue).attr("data-CountUpJs")) {
            var factsOptions = {
              useEasing: false,
              useGrouping: true,
              separator: ",",
              decimal: ".",
              decimalPlaces: 4,
            };

            var countFrom = $(thisItemQueue)
              .attr("data-CountUpJs")
              .split(", ")[0];
            var countTo = $(thisItemQueue)
              .attr("data-CountUpJs")
              .split(", ")[1];
            var count3 = $(thisItemQueue).attr("data-CountUpJs").split(", ")[2];
            var count4 = $(thisItemQueue).attr("data-CountUpJs").split(", ")[3];
            var factsCount = new CountUp(
              thisItemQueue,
              countFrom,
              countTo,
              count3,
              count4,
              factsOptions
            );
            factsCount.start();
          }

          processItemQueue();
        } else {
          window.clearInterval(queueTimer);
          queueTimer = null;
        }
      }, delay);
    }

    function inView() {
      var inViewEl = [].slice.call(
        document.querySelectorAll("[data-inView], [data-CountUpJs]")
      );
      if ("IntersectionObserver" in window) {
        var fadeInUpObserver = new IntersectionObserver(function (
          entries,
          observer
        ) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var thisInViewEl = entry.target;
              itemQueue.push(thisInViewEl);
              processItemQueue();
              fadeInUpObserver.unobserve(thisInViewEl);
            }
          });
        });

        inViewEl.forEach(function (inViewEl) {
          fadeInUpObserver.observe(inViewEl);
        });
      } else {
        inViewEl.forEach(function (inViewEl) {
          inViewEl.classList.add("inView-activated");
        });
      }
    }
    inView();
  }

  // paralax
  if ($("[data-parallax]").length) {
    // apply parallax effect to any element with a data-parallax attribute
    gsap.to("[data-parallax]", {
      y: (i, el) =>
        (1 - parseFloat(el.getAttribute("data-parallax"))) *
        ScrollTrigger.maxScroll(window),
      ease: "none",
      scrollTrigger: {
        start: 0,
        end: "max",
        invalidateOnRefresh: true,
        scrub: 0,
      },
    });
  }

  if ($(".module-homeTopFold").length) {
    if (ajaxRunCondition_doNotRunOnOpen()) {
      // refresh scrolltrigger pin when close ajax panel
      $(".module-homeTopFold .pin-spacer")
        .children()
        .attr("style", "")
        .unwrap();

      // pin bg
      ScrollTrigger.create({
        trigger: $(".module-homeTopFold"),
        endTrigger: $(".module-homeTopFold + .module-listings"),
        start: "top top",
        end: "bottom bottom",
        pin: $(".module-homeTopFold .stickyBg"),
        pinSpacing: false,
        invalidateOnRefresh: true,
      });

      // dim background
      gsap.to($(".module-homeTopFold .mediaWrapStyling"), {
        opacity: 0.4,
        scrollTrigger: {
          trigger: $(".module-homeTopFold"),
          start: "100% 100%",
          end: "bottom 50%",
          invalidateOnRefresh: true,
          scrub: 0,
        },
      });

      // add scroll trigger to stop play top fold video when outside view
      ScrollTrigger.create({
        trigger: $(".module-homeTopFold"),
        endTrigger: $(".module-homeTopFold + .module-listings"),
        start: "top 100%",
        end: "bottom 0%",
        invalidateOnRefresh: true,
        onEnter: function (self) {
          vid = $(self.trigger).find("video:visible")[0];
          if (vid) {
            var playPromise = vid.play();
            if (playPromise !== undefined) {
              playPromise.then((_) => {}).catch((error) => {});
            }
          }
        },
        onEnterBack: function (self) {
          vid = $(self.trigger).find("video:visible")[0];
          if (vid) {
            var playPromise = vid.play();
            if (playPromise !== undefined) {
              playPromise.then((_) => {}).catch((error) => {});
            }
          }
        },
        onLeave: function (self) {
          vid = $(self.trigger).find("video:visible")[0];
          if (vid) {
            vid.pause();
          }
        },
        onLeaveBack: function (self) {
          vid = $(self.trigger).find("video:visible")[0];
          if (vid) {
            vid.pause();
          }
        },
      });
    }
  }

  if ($(".module-listings").length) {
    if (ajaxRunCondition_doNotRunOnOpen()) {
      // refresh scrolltrigger pin when close ajax panel
      $(".module-listings .pin-spacer").children().attr("style", "").unwrap();

      //  pin feature listing
      var dir = -1;
      ScrollTrigger.matchMedia({
        "(min-width: 1281px)": function () {
          var headerH = 63;
          var _startVal = "50% 50%+=" + headerH / 2 + "px";
          var _endVal = "100% 100%+=100px";
          ScrollTrigger.create({
            trigger: $(".module-listings .stickyItem"),
            endTrigger: $(".module-listings"),
            start: function start() {
              return _startVal;
            },
            end: function end() {
              return _endVal;
            },
            pin: $(".module-listings .stickyItem .eachListing"),
            pinSpacing: false,
            invalidateOnRefresh: true,
            onUpdate: function (self) {
              var newDir = self.direction;
              if (dir != newDir) {
                // run once aftrer changing scroll direction
                var exceedVH =
                  $(".module-listings .stickyItem .eachListing").outerHeight() >
                  document.documentElement.clientHeight - headerH;

                if (newDir == 1) {
                  // scroll down
                  // console.log('scrolling down');
                  if (exceedVH) {
                    _startVal = "100% 100%";
                    _endVal = "100% 100%+=100px";
                  } else {
                    // else no exceed always pin center
                    _startVal = "50% 50%+=" + headerH / 2 + "px";
                    _endVal = "100% 100%+=100px";
                  }
                } else {
                  // scroll back up
                  // console.log('scroll back up');
                  if (exceedVH) {
                    _startVal = "0% 0%+=" + headerH + "px";
                    _endVal = "bottom 100%";
                  } else {
                    // else no exceed always pin center
                    _startVal = "50% 50%+=" + headerH / 2 + "px";
                    _endVal = "100% 100%+=100px";
                  }
                }

                ScrollTrigger.refresh();
                dir = newDir;
                // end run once aftrer changing scroll direction
              }
            },
          });

          //scroll trigger hide
          // var _startCaroNews = "0%+=" + $('.module-caroNews').outerHeight() + " 100%";
          // ScrollTrigger.create({
          //   trigger: $('.module-caroNews + .boxWrapStyling'),
          //   start: _startCaroNews,
          //   end: _startCaroNews,
          //   invalidateOnRefresh: true,
          //   onUpdate: function (self) {
          //     if (self.direction == 1) {
          //       $caroNews.parents('.module-caroNews').addClass('hide');
          //     } else {
          //       $caroNews.parents('.module-caroNews').removeClass('hide');
          //     }
          //   },
          //   start: function start() {
          //     _startCaroNews = "0%+=" + $('.module-caroNews').outerHeight() + " 100%";
          //     return _startCaroNews;
          //   }
          // });
        },
      });
    }
  }

  if ($(".module-singleTopFold").length) {
    // pin bg
    // ScrollTrigger.create({
    //   trigger: $('.module-singleTopFold'),
    //   endTrigger: $('body'),
    //   start: "top top",
    //   end: "bottom bottom",
    //   pin: $('.module-singleTopFold .stickyBg'),
    //   pinSpacing: false,
    //   invalidateOnRefresh: true
    // });

    // dim background
    gsap.to($(".module-singleTopFold .mediaWrapStyling"), {
      opacity: 0.4,
      scrollTrigger: {
        trigger: $(".module-singleTopFold"),
        start: "100% 100%",
        end: "bottom 50%",
        invalidateOnRefresh: true,
        scrub: 1,
      },
    });

    // add scroll trigger to stop play top fold video when outside view
    ScrollTrigger.create({
      trigger: $(".module-singleTopFold"),
      endTrigger: $("body"),
      start: "top 100%",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onEnter: function (self) {
        vid = $(self.trigger).find("video:visible")[0];
        if (vid) {
          var playPromise = vid.play();
          if (playPromise !== undefined) {
            playPromise.then((_) => {}).catch((error) => {});
          }
        }
      },
      onEnterBack: function (self) {
        vid = $(self.trigger).find("video:visible")[0];
        if (vid) {
          var playPromise = vid.play();
          if (playPromise !== undefined) {
            playPromise.then((_) => {}).catch((error) => {});
          }
        }
      },
      onLeave: function (self) {
        vid = $(self.trigger).find("video:visible")[0];
        if (vid) {
          vid.pause();
        }
      },
      onLeaveBack: function (self) {
        vid = $(self.trigger).find("video:visible")[0];
        if (vid) {
          vid.pause();
        }
      },
    });
  }

  // owlWidgetImgGallery
  if ($(".owlWidgetImgGallery").length) {
    owlWidgetImgGallery = $(".owlWidgetImgGallery");
    owlWidgetImgGallery.owlCarousel({
      margin: 15,
      items: 1,
      nav: false,
      dots: true,
      dotsEach: false,
      mouseDrag: true,
      touchDrag: true,
      autoplayHoverPause: true,
      responsive: {
        468: {
          items: 1,
        },
        1080: {
          items: 1,
        },
      },
    });
  }

  if ($(".thisAccordionWrap").length) {
    $(".thisAccordionWrap").click(function (e) {
      h = $(this).find(".collapsibleWrap > div").outerHeight();

      // close all accordion
      gsap.to($(".thisAccordionWrap .collapsibleWrap"), 0.3, {
        height: 0,
      });
      $(".thisAccordionWrap").removeClass("toggled");

      // open this accordion
      if ($(this).find(".collapsibleWrap").outerHeight() == 0) {
        gsap.to($(this).find(".collapsibleWrap"), 0.3, {
          height: h,
        });
        $(this).addClass("toggled");
      }

      // close all accordion when resize
      var resizeW_accordion = $(window).width();
      $(window).on("resize", function () {
        if ($(this).width() !== resizeW_accordion) {
          resizeW_accordion = $(this).width();
          clearTimeout(window.accordionResize);
          window.accordionResize = setTimeout(function () {
            gsap.to($(".thisAccordionWrap .collapsibleWrap"), 0.3, {
              height: 0,
            });
            $(".thisAccordionWrap").removeClass("toggled");
          }, 200);
        }
      });
    });
  }

  // fancy box
  Fancybox.bind('[data-fancybox="video"]', {
    // Custom options
    Thumbs: false,
    groupAttr: false,
  });

  Fancybox.bind('[data-fancybox="mailingList"]', {});

  Fancybox.bind('[data-fancybox="mailingListSticky"]', {});

  Fancybox.bind('[data-fancybox="featuredThumb"]', {
    // Custom options
    Thumbs: false,
    groupAttr: true,
  });

  $(".owlWidgetImgGallery").each(function (i, thisOwlWidgetImgGallery) {
    const imgsArr = [];
    $(thisOwlWidgetImgGallery)
      .find("[data-fancybox]")
      .each(function (i, thisImg) {
        const imgObj = { src: $(thisImg).attr("href") };
        imgsArr.push(imgObj);
      });

    $(thisOwlWidgetImgGallery)
      .find("[data-fancybox]")
      .on("click", function () {
        const i = $(this).parents(".owl-item").index();
        var gallery = new Fancybox(imgsArr, {
          groupAll: true,
          startIndex: i,
        });

        return false;
      });
  });

  // close ajax page overlay when click outside
  $("#module-ajaxPanelOverlay").on("click", function (event) {
    var href = $(this).attr("data-backHref");
    barba.go(href);
  });

  $("#module-ajaxPanelOverlay .singleBodyAjaxContents").on(
    "click",
    function (event) {
      event.stopPropagation();
    }
  );
}
