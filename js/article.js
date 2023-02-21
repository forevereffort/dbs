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

function convertToSlug(text) {
  return text.toLowerCase()
    .replace(/[^\w ]+/g, ' ')
    .replace(/ +/g, '-');
}


function init(){
  

  if($('.storiesTheme').length){

    $('.storiesTheme a').each(function(){
      var getAtext = $(this).text();
      var slugText = convertToSlug(getAtext);
      // console.log(slugText);
      $(this).attr('href', "../stories.html?theme="+slugText+"#list");
    })
    
  }

//=================================== end ===========================================
};
