$.fn.extend({
  handyGallery: function(options) {
    $(this).addClass('hg-section')

    var defaults = {
      parKey: 'parValue'
    };
    options = $.extend(defaults, options);
    
    if (!$("#handy-gallery").length) {
      hgCreate()
    }
  
    $('a[data-hg]').on('click', function() {
      hgOpen($(this))
    });

    // console.log(options.parKey);
    return this;
  }
});

function hgCreate() {
  console.log('Create Gallery')
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
        '<div id="hg-screen" class="hg-showpiece-wrapper">' +
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
}

function hgFindShowpieces(container) {
  var showpieces = {}
  $(container).find('[data-hg]').each(function(i, e) {
    let showpiece = {
      title: $(this).closest('[data-hg-title]').text(),
      description: $(this).closest('[data-hg-description]').text(),
      url: $(this).data('hg')
    }
    showpieces[i] = showpiece
  });
  return showpieces;
}

function hgOpen(current) {
  console.log('Open Gallery')

  var current_url = $(current).data('hg')
  var gallery = $(current).parent().closest('.hg-section')
  var showpieces = hgFindShowpieces(gallery)
  
  $(document.body).addClass('hg-active')

  
  $("#hg-screen").addClass('loading').html(
    '<img class="hg-showpeice hg-showpiece-current">'
  )
  currentImge = $('#hg-screen .hg-showpiece-current').attr("src",current_url);

  $(currentImge).on('load',function() {
    $("#hg-screen").removeClass('loading');
    console.log('it is finaly loaded!');
    // alert("will alert even in IE")
  });
    
  hgKeyboardControl()

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
  $(document.body).removeClass('hg-active')
  $('**').off('click.fullscreen')
  $('**').off('click.close')
  $(document).off('keyup.hgKeys')
}

function hgGoFullscreen() {
  console.log('Go Fullscreen')
  $('#handy-gallery').addClass('fullscreen')
}

function hgExitFullscreen() {
  if ($('#handy-gallery').hasClass('fullscreen')) {
    console.log('Exit Fullscreen')
    $('#handy-gallery').removeClass('fullscreen')
  }
}

function hgNextImage() {
  console.log('Next Image')
}

function hgPreviousImage() {
  console.log('Previous Image')
}

function hgKeyboardControl() {
  $(document).on('keyup.hgKeys', function() {
    switch (event.key) {
      case 'Escape':
        if ($('#handy-gallery').hasClass('fullscreen')) {
          hgExitFullscreen()
        } else {
          hgClose()
        }
        break;
        
      case 'ArrowLeft':
        hgPreviousImage()
        break;
        
      case 'Backspace':
        hgPreviousImage()
        break;
        
      case 'ArrowRight':
        hgNextImage()
        break;
        
      case ' ':
        // Space
        hgNextImage()
        break;
        
      case 'Enter':
        if ($('#handy-gallery').hasClass('fullscreen')) {
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
