$.fn.extend({
  handyGallery: function(options) {

    var defaults = {
      parKey: 'parValue'
    };
    options = $.extend(defaults, options);
    
    // hgCreate()
    HGallery = new HandyGallery(this)

  }
});

class HandyGallery {
  constructor(home) {

    self = this

    console.log('Create Gallery From Class')
    home.addClass('hg-library')

    this.gallery
    this.screen
    this.toolbar
    this.btn_next
    this.btn_prev
    this.btn_close
    this.btn_fullscreen

    this.opened = false
    this.fullscreen = false

    this.collection = []
    this.current
    
    if(!this.gallery) {
      this.createGallery()
      this.waitForCall()
    }
  }

  createGallery() {
    if ($('#handy-gallery').length === 0) {
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
      )  
    }

    this.gallery = $('#handy-gallery')
    this.screen = $('#hg-screen')
    this.toolbar = $('#hg-toolbar')
    this.btn_next = $('#hg-next')
    this.btn_prev = $('#hg-previous')
    this.btn_close = $('#hg-close')
    this.btn_fullscreen = $('#hg-fullscreen')

  }

  waitForCall() {
    $(document.body).on('click', 'a[data-hg]', function() {
      if (!self.opened) {
        let url = $(this).data('hg')
        self.library = $(this).parent().closest('.hg-library')
        self.collection = self.collectShowpieces()
        self.openGallery(url)
      }
    });
  }

  collectShowpieces() {
    self = this

    this.samples = this.library.find('[data-hg]')
    this.samples.each(function(i, e) {
      let sample = $(this)
      self.collection[i] = new Showpiece(i+1, sample, self.screen)
    });
    return self.collection
  }

  openGallery(url) {
    console.log('Open Gallery');
    this.opened = true;
    this.interfaceControl()
    this.keyboardControl()
    this.mouseWheelControl()
    this.current = this.collection.find(x => x.url === url).id
    this.show(this.current)
    if (document.body.clientWidth!=window.innerWidth) {
      $(document.body).addClass('hg-show-scrollbar-y')
    }
    $(document.body).addClass('hg-active')
  }

  closeGallery() {
    if (this.fullscreen) {
      this.exitFullscreen()
    }
    console.log('Close Gallery');
    this.screen.html('')
    this.keyboardControl(false)
    this.mouseWheelControl(false)
    this.interfaceControl(false)
    this.opened = false;

    $(document.body).removeClass('hg-show-scrollbar-y')
    $(document.body).removeClass('hg-active')
  }

  show(id) {
    console.log('Show (id='+id+')');
    $(this.collection).each(function(i,e){
      this.object.removeClass('hg-showpiece-next hg-showpiece-previous hg-showpiece-current')
      if(i+1===id-1) {

        //prev

        this.object.addClass('hg-showpiece-previous').attr("src", this.url)
      } else 
      if (i+1===id) {

        //current

        this.object.parent().addClass('loading')
        this.object.addClass('hg-showpiece-current').attr("src", this.url)
        this.object.on('load.currentImage',function() {
          $(this).parent().removeClass('loading')
          $(this).off('load.currentImage')
          console.log('it is finaly loaded!')
        });

        if(id === 1) {
          self.btn_prev.addClass('disable')
        } else {
          self.btn_prev.removeClass('disable')
        }

        if(id === self.collection.length) {
          self.btn_next.addClass('disable')
        } else {
          self.btn_next.removeClass('disable')
        }

      } else 
      if (i+1===id+1) {

        //next

        this.object.addClass('hg-showpiece-next').attr("src", this.url)
      }
    })
  }

  getCurrent() {
    let current = this.collection.find(x => x.id === this.current.id).object
    return current
  }

  getCurrentWrapper() {
    let wrapper = this.getCurrent().closest('.hg-showpiece-wrapper')
    return wrapper
  }

  goNext() {
    let isLast = (this.current === this.collection.length)
    if (!isLast) {
      console.log('Next');
      this.current++
      this.show(this.current)
    }
  }

  goPrevious() {
    let isFirst = (this.current === 1)
    if (!isFirst) {
      console.log('Previous');
      this.current--
      this.show(this.current)
    }
  }

  toggleFullscreen() {
    if (this.fullscreen) {
      this.exitFullscreen()
    } else {
      this.goFullscreen()
    }
  }

  goFullscreen() {
    console.log('Go Fullscreen');
    this.gallery.addClass('fullscreen')
    this.fullscreen = true
    this.browserFullScreen(true)
  }
  
  exitFullscreen() {
    console.log('Exit Fullscreen');
    this.gallery.removeClass('fullscreen')
    this.fullscreen = false
    this.browserFullScreen(false)
  }

  browserFullScreen(enable = true) {
  
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
    }
  }

  interfaceControl(enable = true) {
  
    if (enable === true) {
      this.btn_fullscreen.on('click.fullscreen', function() {
        self.toggleFullscreen()
      });
      this.btn_close.on('click.close', function() {
        self.closeGallery()
      });
      this.btn_next.on('click.close', function() {
        self.goNext()
      });
      this.btn_prev.on('click.close', function() {
        self.goPrevious()
      });
      this.screen.on('dblclick.x2', function() {
        self.toggleFullscreen()
      })
    } else if (enable === false) {
      this.btn_fullscreen.off('click.fullscreen')
      this.btn_close.off('click.close')
      this.btn_next.off('click.close')
      this.btn_prev.off('click.close')
      this.screen.off('dblclick.x2')
    }
  }

  keyboardControl(enable = true) {
    if (enable === true) {
      $(document).on('keydown.hgKeys', function(e) {
        switch (event.key) {
          case 'Escape':
            if (self.fullscreen) {
              self.exitFullscreen()
            } else {
              self.closeGallery()
            }
            e.preventDefault()
            break;
            
          case 'ArrowLeft':
          case 'ArrowUp':
          case 'Backspace':
            
            self.goPrevious()
            e.preventDefault()
            break;
            
          case 'ArrowRight':
          case 'ArrowDown':
          case ' ':
    
            self.goNext()
            e.preventDefault()
            break;
            
          case 'Enter':
          case 'F11':
            self.toggleFullscreen()
            e.preventDefault()
            break;
    
          default:
            break;
        }
      });
    } else if (enable === false){
      $(document).off('keydown.hgKeys')
    }
  }

  mouseWheelControl(enable = true) {
    if (enable === false) {
      $(document).off('mousewheel.hg-scroll')
    } else if (enable === true) {
      $(document).on('mousewheel.hg-scroll', function (e) {
        e.preventDefault()
        let deltaY = e.originalEvent.wheelDelta
        if (deltaY > 0) {
          self.goPrevious()
        } else {
          self.goNext()
        }
      })
    }
  }
}

class Showpiece {
  constructor(id, sample, screen) {
    this.id = id
    this.url = $(sample).data('hg')
    this.createShowpiece(id, screen)
    this.object = $(screen).find('[data-hg-id="'+id+'"]')
  }

  createShowpiece(id, screen) {
    let content =
    '<div class="hg-showpiece-wrapper">' +
      '<svg class="hg-loader" viewbox="0 0 64 64" width="64" height="64"><circle class="hg-loader-circle" stroke="#bebebe" stroke-width="9" stroke-dasharray="0,100" stroke-linecap="round" fill="none" cx="32" cy="32" r="16" /></svg>' +
      '<img class="hg-showpiece" data-hg-id="'+id+'">' +  
    '</div>'
    screen.append(content)
  }
}