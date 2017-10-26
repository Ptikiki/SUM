import FirstChallenge from './FirstChallenge.class.js'
import TweenLite from 'gsap'
import Carousel from './Carousel.class.js'

class Menu {

  constructor(options) {
    this.MenuContainer = new PIXI.Container()
    //this.MenuContainer.alpha = 0
    STORAGE.MenuClass = this
    STORAGE.stage.addChild(this.MenuContainer)

    this.icone3 = document.getElementById("icone3")
    STORAGE.path = document.getElementById("path")
    STORAGE.path.state = 0
    STORAGE.epreuves = document.getElementById("epreuves")
    STORAGE.epreuves.x = window.innerWidth
    STORAGE.timelinePosition = document.querySelector('.js-timeline-position')
    STORAGE.epreuves.alpha = 0

    this.navItems = document.querySelectorAll('.navItem')
    this.clicked = false


    this.init()
    this.bind()
  }

  init() {
    TweenLite.set(STORAGE.timelinePosition, {
      x: -5
    })
  }

  bind() {
    let that = this
    this.icone3.onclick = function(){
      if (STORAGE.path.state == 0) {
        that.onIcone3Click()
        STORAGE.path.state = 1
      } else {
        that.onIcone3ClickAgain()
        STORAGE.path.state = 0
      }
    }

    for (var i = 0; i < this.navItems.length; i++) {
      this.navItems[i].addEventListener('click', that.handleNavItemClick)
    }
  }

  onIcone3Click() {
    TweenLite.set(STORAGE.epreuves, {
      display: "block"
    })

    TweenLite.to(STORAGE.path, 0.6, {
      height: '55vh'
    })
    if (STORAGE.time_pourcentage == 30) {
      TweenLite.to(STORAGE.timelinePosition, 0.6, {
        y: 120,
        autoAlpha: 1,
      })
    }
    else if (STORAGE.time_pourcentage == 60) {
      TweenLite.to(STORAGE.timelinePosition, 0.6, {
        y: 250,
        autoAlpha: 1,
      })
    }
    else if (STORAGE.time_pourcentage == 90) {
      TweenLite.to(STORAGE.timelinePosition, 0.6, {
        y: 365,
        autoAlpha: 1
      })
    }
    TweenLite.to(STORAGE.epreuves, 0.6, {
      x: -50,
      autoAlpha: 1,
      delay: 0.6
    })
  }
  onIcone3ClickAgain() {
    TweenLite.to(STORAGE.path, 0.6, {
      height: 0,
      delay: 0.6,
    })
    TweenLite.to(STORAGE.timelinePosition, 0.6, {
      y: 0,
      autoAlpha: 0,
      delay: 0.6
    })
    TweenLite.to(STORAGE.epreuves, 0.6, {
      x: 0,
      autoAlpha: 0,
      onComplete: function() {
        TweenLite.set(STORAGE.epreuves, {
          display: "none"
        })
      }
    })
  }

  handleNavItemClick(e) {

    if (!STORAGE.MenuClass.clicked) {

      STORAGE.MenuClass.clicked = true

      let id = e.target.closest('li').getAttribute('id').split('-')[1]

      if (STORAGE.carouselClass) {
        STORAGE.carouselClass.unbind()
      }

      STORAGE.soundManagerClass.stopAmbiance(STORAGE.soundManagerClass.ambiance)
      if (STORAGE.soundManagerClass.murmure) {
        STORAGE.soundManagerClass.stopMurmure(STORAGE.soundManagerClass.murmure)
      }


      TweenLite.to([STORAGE.stage], 0.3, {
        alpha: 0,
        onComplete: function() {
          setTimeout(function() {
            if (STORAGE.carouselClass) {
              STORAGE.carousel.destroy()
              STORAGE.carousel = null
              STORAGE.carouselClass = null
              STORAGE.deformation = null
              STORAGE.deformationClass = null
            }

            if (STORAGE.FirstChallengeClass) {
              TweenLite.to([STORAGE.conclusionChallengeTextContainer], 0.3, {
                autoAlpha: 0
              })
              TweenLite.to([STORAGE.FirstChallengeContainer], 0.3, {
                alpha: 0,
                delay: 0.2,
                onComplete: function() {
                  TweenLite.set([STORAGE.FirstChallengeContainer, STORAGE.conclusionChallengeTextContainer], {
                    display:'none'
                  })
                  STORAGE.FirstChallengeClass.unbind()
                  STORAGE.FirstChallengeContainer.destroy()
                  STORAGE.FirstChallengeContainer = null
                  STORAGE.conclusionChallengeTextContainer = null
                  STORAGE.FirstChallengeClass = null
                }
              })
            }

            if (STORAGE.ThirdChallengeClass) {
              TweenLite.to([STORAGE.conclusionChallengeTextContainer], 0.3, {
                autoAlpha: 0
              })
              TweenLite.to([STORAGE.ThirdChallengeContainer], 0.3, {
                alpha: 0,
                delay: 0.2,
                onComplete: function() {
                  TweenLite.set([STORAGE.ThirdChallengeContainer, STORAGE.conclusionChallengeTextContainer], {
                    display:'none'
                  })
                  STORAGE.ThirdChallengeClass.unbind()
                  STORAGE.ThirdChallengeContainer.destroy()
                  STORAGE.ThirdChallengeContainer = null
                  STORAGE.conclusionChallengeTextContainer = null
                  STORAGE.ThirdChallengeClass = null
                }
              })

            }

            if (STORAGE.SecondChallengeClass) {
              TweenLite.to([STORAGE.conclusionChallengeTextContainer], 0.3, {
                autoAlpha: 0
              })
              TweenLite.to([STORAGE.SecondChallengeContainer], 0.3, {
                alpha: 0,
                delay: 0.2,
                onComplete: function() {
                  TweenLite.set([STORAGE.SecondChallengeContainer, STORAGE.conclusionChallengeTextContainer], {
                    display:'none'
                  })
                  STORAGE.SecondChallengeClass.unbind()
                  STORAGE.SecondChallengeContainer.destroy()
                  STORAGE.SecondChallengeContainer = null
                  STORAGE.conclusionChallengeTextContainer = null
                  STORAGE.SecondChallengeClass = null
                }
              })
            }

            setTimeout(function() {
              if (id == 1) {
                new Carousel({ number: 1 })
              } else if (id == 2) {
                new Carousel({ number: 2 })
              } else if (id == 3) {
                new Carousel({ number: 3 })
              }
            }, 700)


            TweenLite.to([STORAGE.carousel, STORAGE.stage], 0.5, {
              alpha: 1,
              delay: 1
            })
          }, 1000)

          setTimeout(function() {
            TweenLite.set(STORAGE.epreuves, {
              display: "none"
            })
          }, 2000)
        },
        delay: 0.4
      })

      setTimeout(function() {
        STORAGE.MenuClass.clicked = false
      }, 6000)

    }

  }

}

export default Menu
