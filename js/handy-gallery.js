var hg_gallery
var hg_screen
var hg_home
var hg_showpieces = {
  list: {},
  current: {
    id: '',
    url: ''
  },
  total:'0'
}

$.fn.extend({
  handyGallery: function(options) {
    hg_home = $(this)
    hg_home.addClass('hg-home')

    var defaults = {
      parKey: 'parValue'
    };
    options = $.extend(defaults, options);
    
    hgCreate()
  
    $('a[data-hg]').on('click', function() {
      hg_showpieces.current.url = $(this).data('hg')
      hg_home = $(this).parent().closest('.hg-home')
      hgOpen()
    });

    return this;
  }
});

function hgCreate() {
  console.log('Create Gallery')
  if (!$('#handy-gallery').length) {
    $(document.body).append(
      '<div id="handy-gallery" class="hg-backdrop">' +
        '<div class="hg-toolbar-wrapper">' +
          '<div class="hg-toolbar">' +
            '<div id="hg-fullscreen" class="hg-toolbar-control">Fullscreen</div>' +
            '<div id="hg-close" class="hg-toolbar-control">Close</div>' +
          '</div>' +
        '</div>' +
        '<div class="hg-showpiece-section">' +
          '<div class="hg-control-wrapper hg-control-wrapper-l">' +
            '<div id="hg-previous" class="hg-control hg-control-l">Prev</div>' +
          '</div>' +
          '<div id="hg-screen">' +
          '</div>' +
          '<div class="hg-control-wrapper hg-control-wrapper-r">' +
            '<div id="hg-next" class="hg-control hg-control-r">Next</div>' +
          '</div>' +
        '</div>' +
        '<div class="hg-infobar-wrapper">' +
            '<div class="hg-infobar">Infobar</div>' +
        '</div>' +
      '</div>'
    );
    hg_gallery = $('#handy-gallery')
    hg_screen = $('#hg-screen')
  }
}

function hgCollectShowpieces() {
  hg_home.find('[data-hg]').each(function(i, e) {
    let title = $(this).data('hg-title')
    let description = $(this).data('hg-description')
    let url = $(this).data('hg')
    let id = i+1

    if(url == hg_showpieces.current.url) {
      hg_showpieces.current.id = id
    }

    let showpiece = {
      id: id,
      title: (typeof title !=='undefined') ? title : '',
      description: (typeof description !=='undefined') ? description : '',
      url: url
    }
    hg_showpieces.total = id;
    hg_showpieces.list[i] = showpiece
    createShowpiece(showpiece)
  });
}

function createShowpiece(showpiece) {
  let content =
    '<div class="hg-showpiece-wrapper">' +
      '<svg class="hg-loader" viewbox="0 0 64 64" width="64" height="64"><circle class="hg-loader-circle" stroke="#bebebe" stroke-width="9" stroke-dasharray="0,100" stroke-linecap="round" fill="none" cx="32" cy="32" r="16" /></svg>' +
      '<img class="hg-showpiece" data-hg-id="'+showpiece.id+'">' +  
    '</div>'
  hg_screen.append(content)
}

function hgGetCurrentObj() {
  return $('.hg-showpiece[data-hg-id="'+hg_showpieces.current.id+'"]')
}
function hgGetCurrentWrapper() {
  return $('.hg-showpiece[data-hg-id="'+hg_showpieces.current.id+'"]').parent()
}

function hgSetCurrent() {
  id = hg_showpieces.current.id
  $('.hg-showpiece').removeClass('hg-showpiece-current')
  let currentShowpiece = hgGetCurrentObj().attr("src",hg_showpieces.list[id-1].url).addClass('hg-showpiece-current');
  let currentShowpieceWrapper = hgGetCurrentWrapper()
  currentShowpieceWrapper.addClass('loading')
  currentShowpiece.on('load.currentImage',function() {
    currentShowpieceWrapper.removeClass('loading')
    currentShowpiece.off('load.currentImage')
    console.log('it is finaly loaded!')
  });
}

function hgOpen() {
  console.log('Open Gallery')

  hgCollectShowpieces()
  
  if (document.body.clientWidth!=window.innerWidth) {
    $(document.body).addClass('hg-show-scrollbar-y')
  }

  $(document.body).addClass('hg-active')

  hgSetCurrent()

  hgKeyboardControl()
  hgScrollControl()

  $('#hg-fullscreen').on('click.fullscreen', function() {
    hgGoFullscreen()
  });
  $('#hg-close').on('click.close', function() {
    hgClose()
  });
}

function hgClose() {
  hgExitFullscreen();
  console.log('Close Gallery')
  hgScrollControl(false)
  hg_showpieces = {
    list: {},
    current: {
      id: '',
      url: ''
    }
  }
  hg_screen.html('')
  $(document.body).removeClass('hg-active')
  if (document.body.clientWidth!=window.innerWidth) {
    $(document.body).removeClass('hg-show-scrollbar-y')
  }
  $('**').off('click.fullscreen')
  $('**').off('click.close')
  $('**').off('load.currentImage')
  $(document).off('keyup.hgKeys')
  let currentImge = $('#hg-screen .hg-showpiece-current').removeClass('hg-showpiece-current');
  setTimeout(() => {
    currentImge.attr("src","img/spacer.png");
  }, 500);
}

function hgGoFullscreen() {
  console.log('Go Fullscreen')
  if (document.body.clientWidth!=window.innerWidth) {
    $(document.body).removeClass('hg-show-scrollbar-y')
  }
  hgBrowserFullScreen()
  hg_gallery.addClass('fullscreen')
}

function hgExitFullscreen() {
    console.log('Exit Fullscreen')
    if (document.body.clientWidth==window.innerWidth) {
      $(document.body).addClass('hg-show-scrollbar-y')
    }
    hgBrowserFullScreen(false)
    hg_gallery.removeClass('fullscreen')
}

function hgNextImage() {
  let isLast = (hg_showpieces.current.id == hg_showpieces.total)
  // console.log('isLast? '+isLast);
  if (!isLast) {
    console.log('Next Image')
    hg_showpieces.current.id++
    hgSetCurrent()
  }
}

function hgPreviousImage() {
  let isFirst = (hg_showpieces.current.id == 1)
  // console.log('isFirst? '+isFirst);
  if (!isFirst) {
    console.log('Previous Image')
    hg_showpieces.current.id--
    hgSetCurrent()
  }
}

function hgKeyboardControl() {
  $(document).on('keyup.hgKeys', function(e) {
    switch (event.key) {
      case 'Escape':
        console.log('Escape!!!');
        if (hg_gallery.hasClass('fullscreen')) {
          hgExitFullscreen()
        } else {
          hgClose()
        }
        break;
        
      case 'ArrowLeft':
      case 'ArrowUp':
        hgPreviousImage()
        break;
        
      case 'Backspace':
        hgPreviousImage()
        break;
        
      case 'ArrowRight':
      case 'ArrowDown':

        hgNextImage()
        break;
        
      case ' ':
        // Space
        hgNextImage()
        break;
        
      case 'Enter':
      case 'F11':
        if (hg_gallery.hasClass('fullscreen')) {
          hgExitFullscreen()
        } else {
          hgGoFullscreen()
        }
        break;

      default:
        break;
    }
    
  });
}

function hgScrollControl(enable = true) {
  if (enable === false) {
    $(document).off('mousewheel.hg-scroll')
  } else if (enable === true) {
    $(document).on('mousewheel.hg-scroll', function (e) {
      let deltaY = e.originalEvent.wheelDelta
      e.preventDefault()
      if (deltaY > 0) {
        hgPreviousImage()
      } else {
        hgNextImage()
      }
    })
  } else {
    console.log('Invalid argument of hgScrollControl function')
    return false;
  }
}

function hgBrowserFullScreen(enable = true) {
  
  if (enable === true) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
      document.documentElement.msRequestFullscreen();
    }
  } else if (enable === false) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      document.msExitFullscreen();
    }
  } else {
    console.log('Invalid argument of hgBrowserFullScreen function')
    return false;
  }
}