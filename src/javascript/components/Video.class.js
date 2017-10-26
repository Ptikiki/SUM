import Blackboard from './Blackboard.class.js'
import videoDatas from '../datas/videoDatas.js'
import Carousel from './Carousel.class.js'
import TweenLite from 'gsap'

class Video {

  constructor(options) {
    this.VideoContainer = new PIXI.Container()
    this.VideoContainer.alpha = 0
    STORAGE.VideoClass = this
    this.videoNumber = options.number
    STORAGE.VideoContainer = this.VideoContainer
    STORAGE.stage.addChild(this.VideoContainer)

    this.assets = {}

    this.videoButton = document.querySelector('.js-video-button')

    STORAGE.videoRatioVertical = 1

    this.largeurVideo = 576
    this.hauteurVideo = 320

    this.init()
    this.playVideo()

    this.bind()

  }

  init() {
    TweenLite.to(STORAGE.stage, 1.6, {
      alpha: 1
    })
    TweenLite.to(this.VideoContainer, 1.6, {
      alpha: 1
    })
  }

  bind() {
    let that = this
    window.addEventListener('resize', that.handleResize)
  }

  unbind() {
    let that = this
    window.removeEventListener('resize', that.handleResize)
  }

  handleResize() {
    STORAGE.renderer.resize(window.innerWidth, window.innerHeight)
    let timeOut
    clearTimeout(timeOut)

    timeOut = setTimeout(()=> {
      STORAGE.VideoClass.resize()
    }, 200)
  }

  playVideo() {
    let that = this

    if (this.videoNumber == 1) {
      this.texture = PIXI.Texture.fromVideo('assets/introduction.mp4')
    }
    else if (this.videoNumber == 2) {
      this.texture = PIXI.Texture.fromVideo('assets/conclusion.mp4')
      STORAGE.videoConclusion = this.texture.baseTexture.source
      TweenLite.set(STORAGE.videoConclusion, {
        volume: 0
      })
      TweenLite.to(STORAGE.videoConclusion, 4, {
        volume: 1
      })
    }
    this.videoSprite = new PIXI.Sprite(this.texture)

    this.ratio = window.innerWidth/this.largeurVideo
    this.videoSprite.width = this.largeurVideo * this.ratio
    this.videoSprite.height = this.hauteurVideo * this.ratio

    this.videoSprite.x = 0
    this.videoSprite.y = (window.innerHeight-this.videoSprite.height)/2

    this.VideoContainer.addChild(this.videoSprite)


    if (this.videoNumber == 1) {
      setTimeout(function(){
        TweenLite.to([STORAGE.stage], 0.4, {
          alpha: 1,
          onComplete: function() {
            setTimeout(function() {
              STORAGE.videoIntro = that.texture.baseTexture.source
              TweenLite.to(STORAGE.videoIntro, 4, {
                volume: 0,
                onComplete: function() {
                  STORAGE.videoIntro.pause()
                }
              })
              console.log(STORAGE.VideoClass.videoButton)
              TweenLite.to(STORAGE.VideoClass.videoButton, 0.3, {
                autoAlpha: 1,
                onComplete: function() {
                  STORAGE.VideoClass.videoButton.addEventListener('click', STORAGE.VideoClass.launchXP)
                }
              })
            }, 200)
          }
        })
      }, 95000) //durée de la vidéo,  92000
    }
  }

  launchXP() {
    TweenLite.to([STORAGE.stage], 0.4, {
      alpha: 0,
      onComplete: function() {
        TweenLite.to(STORAGE.VideoClass.videoButton, 0.3, {
          autoAlpha: 0
        })
        STORAGE.VideoClass.videoButton.removeEventListener('click', STORAGE.VideoClass.launchXP)
        setTimeout(function() {
          STORAGE.VideoContainer.destroy()
          new Carousel({ number: 1 })
          TweenLite.to(STORAGE.stage, 1.5, {
            alpha: 1
          })
        })
      }
    })
  }

  resize() {
    this.ratio = window.innerWidth/this.largeurVideo
    this.videoSprite.width = this.largeurVideo * this.ratio
    this.videoSprite.height = this.hauteurVideo * this.ratio

    this.videoSprite.y = (window.innerHeight-this.videoSprite.height)/2

  }

}

export default Video
