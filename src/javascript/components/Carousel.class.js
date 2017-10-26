import Blackboard from './Blackboard.class.js'
import firstCarouselDatas from '../datas/firstCarouselDatas.js'
import secondCarouselDatas from '../datas/secondCarouselDatas.js'
import thirdCarouselDatas from '../datas/thirdCarouselDatas.js'
import soundBank from '../datas/soundBank.js'

class Carousel {

    constructor(options) {
      this.carousel = new PIXI.Container()
      STORAGE.carouselClass = this
      STORAGE.carousel = this.carousel
      STORAGE.stage.addChild(this.carousel)

      this.carouselNumber = options.number
      if (this.carouselNumber == 1) {
        this.carouselDatas = firstCarouselDatas
        STORAGE.carousel.numberOfWindow = 10
        STORAGE.time_pourcentage = 30
        STORAGE.soundManagerClass.launchAmbianceBeginning(soundBank.firstChallengeCarousel.ambiance_beginning, soundBank.firstChallengeCarousel.ambiance_loop)
      } else if (this.carouselNumber == 2) {
        this.carouselDatas = secondCarouselDatas
        STORAGE.soundManagerClass.launchAmbianceBeginning(soundBank.secondChallengeCarousel.ambiance_beginning, soundBank.secondChallengeCarousel.ambiance_loop)
        STORAGE.carousel.numberOfWindow = 6
        STORAGE.time_pourcentage = 60
      } else if (this.carouselNumber == 3) {
        this.carouselDatas = thirdCarouselDatas
        STORAGE.soundManagerClass.launchAmbianceBeginning(soundBank.thirdChallengeCarousel.ambiance_beginning, soundBank.thirdChallengeCarousel.ambiance_loop)
        STORAGE.carousel.numberOfWindow = 6
        STORAGE.time_pourcentage = 90
      }

      this.menu = document.querySelector('.js-menu')

      this.spritesFonds = {}
      this.spritesForms = {}
      this.assets = {}
      this.totalHeightSteps = [0]
      STORAGE.ratioVertical = 1

      this.blackboards = []

      // sounds
      this.voiceOverLaunch = false
      this.launchMurmure = false

      // animattion
      this.animeUpAndBlur = false
      this.animeZigZag = false
      this.animeZigZag2 = false
      this.scaleDone = []


      this.blurFilter = new PIXI.filters.BlurFilter()
      this.blurFilter.blur = 0

      STORAGE.stage.filters = [
        this.blurFilter
      ]

      this.init()
      this.bind()
    }

    init() {
      this.reinitializeMenu()

      TweenLite.to(this.menu, 1, {
        autoAlpha : 1
      })

      if (STORAGE.loader.carousel1 && this.carouselNumber == 1) {
        STORAGE.loader.resources = STORAGE.loader.carousel1
        this.setupCarouselPicturesLoaded()
      } else if (STORAGE.loader.carousel2 && this.carouselNumber == 2) {
        STORAGE.loader.resources = STORAGE.loader.carousel2
        this.setupCarouselPicturesLoaded()
      } else if (STORAGE.loader.carousel3 && this.carouselNumber == 3) {
        STORAGE.loader.resources = STORAGE.loader.carousel2
        this.setupCarouselPicturesLoaded()
      } else {
        STORAGE.loaderClass.loadCarouselPictures(this.carouselDatas.datasImages)
      }

    }

    bind() {
      let that = this
      window.addEventListener('mousewheel', that.handleScroll)
      window.addEventListener('resize', that.handleResize)

      if (this.carouselNumber == 2) {
        this.opacityTimer = window.setInterval(that.doOpacity, 3000)
      }

      if (this.carouselNumber == 3) {
        this.rotationTimer1 = window.setInterval(that.doRotation1, 1550)
      }
    }

    unbind() {
      let that = this
      window.removeEventListener('mousewheel', that.handleScroll)
      window.removeEventListener('resize', that.handleResize)
      document.body.style.cursor = 'auto'

      window.clearInterval(STORAGE.carouselClass.opacityTimer)

      window.clearInterval(STORAGE.carouselClass.rotationTimer1)

    }

    reinitializeMenu() {
      TweenLite.to(STORAGE.path, 0.6, {
        height: 0,
        delay: 0.6
      })
      TweenLite.to(STORAGE.timelinePosition, 0.6, {
        y: 0,
        opacity: 0,
        delay: 0.6
      })
      TweenLite.to(STORAGE.epreuves, 0.6, {
        x: 0,
        opacity: 0
      })
    }

    loadCarouselPicturesProgressHandler() {
    }

    setupCarouselPicturesLoaded() {
      let that = this
      this.assets.resources = STORAGE.loader.resources

      Object.keys(this.assets.resources).map(function(objectKey, index) {
        const sprite = new PIXI.Sprite(that.assets.resources[objectKey].texture)

        if (objectKey.split('.')[1] == 'jpg') {
          that.spritesFonds[objectKey] = sprite
        } else if (objectKey.split('.')[1] == 'png') {
          that.spritesForms[objectKey] = sprite
        } else if (objectKey.split('.')[1] == 'gif') {
          that.spritesForms[objectKey] = sprite
        }

        that.carousel.addChild(sprite)
      })
      this.makeCarousel()
    }

    makeCarousel() {

      this.totalHeightSteps = [0]

      let that = this
      Object.keys(that.spritesFonds).map(function(objectKey, index) {

        STORAGE.ratioHorizontal = window.innerWidth / that.spritesFonds[objectKey].texture.width
        that.spritesFonds[objectKey].scale = new PIXI.Point(STORAGE.ratioHorizontal , STORAGE.ratioHorizontal)

          for (var i = 0; i < Math.floor(STORAGE.carousel.numberOfWindow); i++) {
            that.totalHeightSteps.push(that.totalHeightSteps[that.totalHeightSteps.length -1] + that.spritesFonds[objectKey].height / Math.floor(STORAGE.carousel.numberOfWindow))
          }

          that.spritesFonds[objectKey].zIndex = 1
      })

      let keysForms = Object.keys(that.spritesForms)
      let lastForm = keysForms[keysForms.length-1]

      Object.keys(that.spritesForms).map(function(objectKey, index) {

        // pour que chaque image fasse 100% de largeur
        that.spritesForms[objectKey].scale = new PIXI.Point(STORAGE.ratioHorizontal , STORAGE.ratioHorizontal)

        // pour placer en y
        if (objectKey == lastForm) {
          let position = objectKey.split('.')[0].split('/')[2].split('-')[0]
          that.spritesForms[objectKey].y = that.totalHeightSteps[position]

        } else {
          let position = objectKey.split('.')[0].split('/')[2].split('-')[0]
          that.spritesForms[objectKey].y = that.totalHeightSteps[position]
        }

        that.spritesForms[objectKey].zIndex = 2

        if (objectKey == lastForm) {
          that.spritesForms[objectKey].rapidity = 0
        } else {
          if (that.carouselNumber == 1) {
            that.spritesForms[objectKey].rapidity = Math.random() * (1.2 - 0.4) + 0.4
          } else if(that.carouselNumber == 2){
            that.spritesForms[objectKey].rapidity = Math.random() * (0.8 - 0.1) + 0.1
          } else if(that.carouselNumber == 3){
            that.spritesForms[objectKey].rapidity = Math.random() * (0.8 - 0.1) + 0.1
          }

        }
      })

      for (var i = 0; i < this.blackboards.length; i++) {
        this.blackboards[i].blackboard.destroy()
      }

      this.blackboards = []
      this.initBlackboards()
    }

    initBlackboards() {
      for(let i = 0; i < this.carouselDatas.datasBlackboards.length; i++) {
        this.blackboards.push(new Blackboard({ index : i, context : "Carousel" }))
      }
    }

    handleScroll(e) {
      if (Math.abs(STORAGE.carousel.y - window.innerHeight) <  STORAGE.carouselClass.totalHeightSteps[1] * STORAGE.carousel.numberOfWindow - 25 && e.deltaY > 0 ) { // stop le défilement au dernier sprite (défile tant que x abs < à largeur totale de tous les spritesFonds-1)
        STORAGE.carousel.y -= Math.abs(e.deltaY) / 5
        STORAGE.carouselClass.doParallax('down')
      } else if (STORAGE.carousel.y > -25) {
        return
      } else if (e.deltaY < 0) {
        STORAGE.carousel.y += Math.abs(e.deltaY) / 5
        STORAGE.carouselClass.doParallax('up')
      }

      if ( STORAGE.carouselClass.animeUpAndBlur != true && STORAGE.carousel.y < -2000 && STORAGE.carouselClass.carouselNumber == 1) {
        STORAGE.carouselClass.doAnimeUpAndBlur()
      }

      if (STORAGE.carousel.y < -4300 && STORAGE.carouselClass.carouselNumber == 1) {
        STORAGE.carouselClass.doScale(22, 0.6, 0.17)
        STORAGE.carouselClass.doScale(24, 2, 0.17)
        STORAGE.carouselClass.doScale(25, 1.2, 0.13)
        STORAGE.carouselClass.doScale(26, 0.8, 0.10)
      }



      // carousel 1 ambiance2
      if (STORAGE.carouselClass.carouselNumber == 1 && STORAGE.carousel.y < -1800 && STORAGE.carouselClass.launchMurmure != true) {
        STORAGE.soundManagerClass.launchMurmure(soundBank.firstChallengeCarousel.ambiance_chuchotements)
        STORAGE.carouselClass.launchMurmure = true
      }

      // carousels ambiances
      if (STORAGE.carouselClass.carouselNumber == 1) {
        if (STORAGE.carouselClass.voiceOverLaunch != true && STORAGE.carousel.y < -3000) {
          STORAGE.soundManagerClass.launchVoiceOver(soundBank.voiceOver.firstChallengeCarousel)
          STORAGE.carouselClass.voiceOverLaunch = true
        }
      }
      else if (STORAGE.carouselClass.carouselNumber == 2) {
        if (STORAGE.carouselClass.voiceOverLaunch != true && STORAGE.carousel.y < -2000) {
          STORAGE.soundManagerClass.launchVoiceOver(soundBank.voiceOver.secondChallengeCarousel)
          STORAGE.carouselClass.voiceOverLaunch = true
        }
      }
      else if (STORAGE.carouselClass.carouselNumber == 3) {
        if (STORAGE.carouselClass.voiceOverLaunch != true && STORAGE.carousel.y < -2000) {
          STORAGE.soundManagerClass.launchVoiceOver(soundBank.voiceOver.thirdChallengeCarousel)
          STORAGE.carouselClass.voiceOverLaunch = true
        }
      }
    }

    handleResize() {
      STORAGE.renderer.resize(window.innerWidth, window.innerHeight)
      let timeOut
      clearTimeout(timeOut)
      timeOut = setTimeout(()=> {
        STORAGE.carouselClass.makeCarousel()
      }, 200)
    }

    doScale(shapeIndex, duration, size) {
      if (document.hasFocus() ) {
        Object.keys(STORAGE.carouselClass.spritesForms).map(function(objectKey, index) {
          if (index == shapeIndex && STORAGE.carouselClass.scaleDone[shapeIndex] != shapeIndex) {
            let initialX = STORAGE.carouselClass.spritesForms[objectKey].x
            let initialY = STORAGE.carouselClass.spritesForms[objectKey].y

            TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey].scale, duration, {
              x : "+=" + size,
              y : "+=" + size,
              ease: Power2.easeInOut,
              onUpdate: function() {
                TweenLite.set(STORAGE.carouselClass.spritesForms[objectKey], {
                  x: initialX -( STORAGE.carouselClass.spritesForms[objectKey].width - window.innerWidth ) / 2,
                  y: initialY -( STORAGE.carouselClass.spritesForms[objectKey].width - window.innerWidth ) / 2
                })
              }
            })
            STORAGE.carouselClass.scaleDone[shapeIndex] = shapeIndex
          }
        })
      }
    }

    doAnimeUpAndBlur() {
      TweenLite.to( STORAGE.carousel, 1.6, {
        y: -800,
        ease: Power2.easeInOut
      })
      TweenLite.to( STORAGE.carousel, 1.4, {
        y: -1700,
        ease: Power4.easeInOut,
        delay: 1.6
      })
      TweenLite.to(STORAGE.carouselClass.blurFilter, 2, {
        blur: 12,
        ease: Power4.easeInOut,
        onUpdate: function() {
          STORAGE.stage.filters = [
            STORAGE.carouselClass.blurFilter
          ]
        },
        onComplete: function() {
          TweenLite.to(STORAGE.carouselClass.blurFilter, 1, {
            blur: 0,
            ease: Power2.easeInOut,
            onUpdate: function() {
              STORAGE.stage.filters = [
                STORAGE.carouselClass.blurFilter
              ]
            }
          })
        }
      })

      STORAGE.carouselClass.animeUpAndBlur = true
    }

    doZigZag2() {
      STORAGE.carouselClass.doZigZag()
      STORAGE.carouselClass.animeZigZag2 = true
    }

    doZigZag() {
      STORAGE.renderer.backgroundColor = 0xffffff

      TweenLite.to( STORAGE.carousel, 4, {
        x:-4,
        ease: Elastic.easeInOut.config(4, 0.1),
        onComplete: function() {
          TweenLite.to( STORAGE.carousel, 0.2, {
            x: 0
          })
        }
      })

      TweenLite.to(STORAGE.carouselClass.blurFilter, 0.7, {
        blur: 8,
        ease: Power4.easeInOut,
        onUpdate: function() {
          STORAGE.stage.filters = [
            STORAGE.carouselClass.blurFilter
          ]
        },
        onComplete: function() {
          TweenLite.to(STORAGE.carouselClass.blurFilter, 4.5, {
            blur: 0,
            ease: Power2.easeInOut,
            onUpdate: function() {
              STORAGE.stage.filters = [
                STORAGE.carouselClass.blurFilter
              ]
            }
          })
        }
      })

      STORAGE.carouselClass.animeZigZag = true

      setTimeout(function() {
        STORAGE.renderer.backgroundColor = 0x000000
      }, 4000)
    }

    doOpacity() {

      if (document.hasFocus() ) {
        Object.keys(STORAGE.carouselClass.spritesForms).map(function(objectKey, index) {
          if (index == 1 || index == 5 || index == 7 || index == 8) {
            TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 1.5, {
              alpha : 0.2,
              ease: Power2.easeIn,
              onComplete: function() {
                TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 1.5, {
                  alpha : 1,
                  ease: Power2.easeIn
                })
              }
            })
          }
          if (index == 0 || index == 6 || index == 9 || index == 12) {

            TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 1.5, {
              alpha : 0.2,
              delay : 1.5,
              ease: Power2.easeIn,
              onComplete: function() {
                TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 1.5, {
                  alpha : 1,
                  ease: Power2.easeIn
                })
              }
            })
          }
        })
      }
    }

    doRotation1() {

      if (document.hasFocus() ) {
        Object.keys(STORAGE.carouselClass.spritesForms).map(function(objectKey, index) {
          if (index == 14) {
            STORAGE.carouselClass.spritesForms[objectKey].anchor.set(0.06, 0.05)
            TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 0.3, {
              rotation : "+=" + 0.1,
              ease: Power1.easeInOut,
              onComplete: function() {
                TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 0.3, {
                  rotation : "-=" + 0.1,
                  ease: Power1.easeInOut
                })
              }
            })
          }
          if (index == 6) {
            STORAGE.carouselClass.spritesForms[objectKey].anchor.set(0.01, 0.05)
            TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 0.5, {
              rotation : "+=" + 0.2,
              ease: Power1.easeInOut,
              onComplete: function() {
                TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 0.5, {
                  rotation : "-=" + 0.2,
                  ease: Power1.easeInOut
                })
              }
            })
          }
          if (index == 7) {
            TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 0.6, {
              rotation : "+=" + 0.05,
              ease: Power1.easeInOut,
              onComplete: function() {
                TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 0.6, {
                  rotation : "-=" + 0.05,
                  ease: Power1.easeInOut
                })
              }
            })
          }
          if (index == 4) {
            TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 0.3, {
              rotation : "+=" + 0.05,
              ease: Power1.easeInOut,
              onComplete: function() {
                TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 0.3, {
                  rotation : "-=" + 0.05,
                  ease: Power1.easeInOut
                })
              }
            })
          }
          if (index == 10) {
            TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 0.3, {
              rotation : "-=" + 0.08,
              ease: Power1.easeInOut,
              onComplete: function() {
                TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 0.3, {
                  rotation : "+=" + 0.08,
                  ease: Power1.easeInOut
                })
              }
            })
          }
          if (index == 12) {
            STORAGE.carouselClass.spritesForms[objectKey].anchor.set(0.01, 0.01)
            TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 0.6, {
              rotation : "-=" + 0.1,
              ease: Power1.easeInOut,
              onComplete: function() {
                TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 0.5, {
                  rotation : "+=" + 0.1,
                  ease: Power1.easeInOut
                })
              }
            })
          }
          if (index == 15) {
            STORAGE.carouselClass.spritesForms[objectKey].anchor.set(0.01, 0.01)
            TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 0.5, {
              rotation : "-=" + 0.05,
              ease: Power1.easeInOut,
              onComplete: function() {
                TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 0.5, {
                  rotation : "+=" + 0.05,
                  ease: Power1.easeInOut
                })
              }
            })
          }
          if (index == 9) {
            TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 0.5, {
              rotation : "+=" + 0.05,
              ease: Power1.easeInOut,
              onComplete: function() {
                TweenLite.to(STORAGE.carouselClass.spritesForms[objectKey], 0.5, {
                  rotation : "-=" + 0.05,
                  ease: Power1.easeInOut
                })
              }
            })
          }
        })
      }
    }

    doParallax(direction) {
      let that = this

      if (direction == 'down') {
        Object.keys(that.spritesForms).map(function(objectKey, index) {
          if (Math.abs(that.carousel.y + that.spritesForms[objectKey].y) < 1000) {
            if (that.carouselNumber == 1 && index == 8 || that.carouselNumber == 1 && index == 12 || that.carouselNumber == 1 && index == 32 || that.carouselNumber == 1 && index == 33 || that.carouselNumber == 1 && index == 37 || that.carouselNumber == 1 && index == 36 || that.carouselNumber == 1 && index == 28 || that.carouselNumber == 2 && index == 4  || that.carouselNumber == 2 && index == 6 || that.carouselNumber == 2 && index == 12 || that.carouselNumber == 3 && index == 3 || that.carouselNumber == 3 && index == 5 || that.carouselNumber == 3 && index == 16 || that.carouselNumber == 3 && index == 9) {
              return
            }
            if (that.carouselNumber == 1 && index == 22 || that.carouselNumber == 1 && index == 11 || that.carouselNumber == 1 && index == 6 || that.carouselNumber == 1 && index == 15 || that.carouselNumber == 1 && index == 13 || that.carouselNumber == 1 && index == 31 || that.carouselNumber == 1 && index == 35 || that.carouselNumber == 1 && index == 34 || that.carouselNumber == 1 && index == 29 || that.carouselNumber == 2 && index == 0 || that.carouselNumber == 2 && index == 7 || that.carouselNumber == 2 && index == 3 || that.carouselNumber == 3 && index == 7 || that.carouselNumber == 3 && index == 11) {
              that.spritesForms[objectKey].y += that.spritesForms[objectKey].rapidity
              return
            }
            that.spritesForms[objectKey].y -= that.spritesForms[objectKey].rapidity
          }
        })
      } else if (direction == 'up') {
        Object.keys(that.spritesForms).map(function(objectKey, index) {
          if (Math.abs(that.carousel.y + that.spritesForms[objectKey].y) < 1000) {
            if (that.carouselNumber == 1 && index == 8 || that.carouselNumber == 1 && index == 12 || that.carouselNumber == 1 && index == 32 || that.carouselNumber == 1 && index == 33 || that.carouselNumber == 1 && index == 37 || that.carouselNumber == 1 && index == 36 || that.carouselNumber == 1 && index == 28 || that.carouselNumber == 2 && index == 4 || that.carouselNumber == 2 && index == 6 || that.carouselNumber == 2 && index == 12 || that.carouselNumber == 3 && index == 3 || that.carouselNumber == 3 && index == 5 || that.carouselNumber == 3 && index == 16 || that.carouselNumber == 3 && index == 9) {
              return
            }
            if (that.carouselNumber == 1 && index == 22 || that.carouselNumber == 1 && index == 11 || that.carouselNumber == 1 && index == 6 || that.carouselNumber == 1 && index == 15 || that.carouselNumber == 1 && index == 13 || that.carouselNumber == 1 && index == 31 || that.carouselNumber == 1 && index == 35 || that.carouselNumber == 1 && index == 34 || that.carouselNumber == 1 && index == 29 || that.carouselNumber == 2 && index == 0 || that.carouselNumber == 2 && index == 7 || that.carouselNumber == 2 && index == 3 || that.carouselNumber == 3 && index == 7 || that.carouselNumber == 3 && index == 11) {
              that.spritesForms[objectKey].y -= that.spritesForms[objectKey].rapidity
              return
            }
            that.spritesForms[objectKey].y += that.spritesForms[objectKey].rapidity
          }
        })
      }
    }
}

export default Carousel
