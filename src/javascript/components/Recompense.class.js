import Carousel from './Carousel.class.js'
import soundBank from '../datas/soundBank.js'
import Video from './Video.class.js'
import TweenLite from 'gsap'

class Recompense {

  constructor(options) {
    STORAGE.ThirdRecompenseClass = this
    this.recompenseNumber = options.number

    this.menu = document.querySelector('.js-menu')

    if (this.recompenseNumber == 1) {
      this.recompense =  document.querySelector('.first-recompense')
    } else if (this.recompenseNumber == 2) {
      this.recompense = document.querySelector('.second-recompense')
    }  else if (this.recompenseNumber == 3) {
      this.recompense = document.querySelector('.third-recompense')
    }

    this.init()
  }

  init() {
    this.recompenseAppearing()
    if (this.recompenseNumber == 1) {
      STORAGE.soundManagerClass.launchAmbianceRecompense(soundBank.firstChallengeCarousel.ambiance_ending)
      setTimeout(function() {
        STORAGE.soundManagerClass.stopAmbiance(STORAGE.soundManagerClass.ambiance)
      }, 3000)
    } else if (this.recompenseNumber == 2) {
      STORAGE.soundManagerClass.launchAmbianceRecompense(soundBank.secondChallengeCarousel.ambiance_ending)
      setTimeout(function() {
        STORAGE.soundManagerClass.stopAmbiance(STORAGE.soundManagerClass.ambiance)
      }, 3000)
    } else if (this.recompenseNumber == 3) {
      STORAGE.soundManagerClass.launchAmbianceRecompense(soundBank.thirdChallengeCarousel.ambiance_ending)
      setTimeout(function() {
        STORAGE.soundManagerClass.stopAmbiance(STORAGE.soundManagerClass.ambiance)
      }, 3000) 
    }
  }

  recompenseAppearing() {

    let that = this

    TweenLite.to(this.menu, 1, {
      autoAlpha : 0,
    })

    TweenLite.set(this.recompense, {
      display:'block',
    })

    TweenLite.to(this.recompense, 4, {
      autoAlpha: 1,
      onComplete: function() {
        if (that.recompenseNumber == 2) {
          document.querySelector('.webGLRenderer').classList.remove('hidden')
          document.querySelector('.canvasRenderer').classList.add('hidden')
          STORAGE.renderCanvas = false
        }
        that.recompenseDisappearing()
      }
    })
  }

  recompenseDisappearing() {

    let that = this

    setTimeout(function(){
      STORAGE.soundManagerClass.stopAmbiance(STORAGE.soundManagerClass.ambianceRecompense)
    }, 5500)

    setTimeout(function(){
      TweenLite.to(that.recompense, 0.5, {
        autoAlpha: 0,
        onComplete: () => {
          if (that.recompenseNumber < 3) {
            new Carousel({ number: that.recompenseNumber + 1 })
            TweenLite.to([STORAGE.carousel, STORAGE.stage], 0.5, {
              alpha: 1,
              delay: 1
            })
          }
          else {
            new Video({ number: 2})
          }

          TweenLite.set(that.recompense, {
            display:'none'
          })

        }
      })
    }, 6000)
  }

}

export default Recompense
