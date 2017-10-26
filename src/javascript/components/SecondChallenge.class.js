import conclusionTextsDatas from '../datas/conclusionTexts.js'
import soundBank from '../datas/soundBank.js'
import Recompense from './Recompense.class.js'
import TweenLite from 'gsap'

class SecondChallenge {

  constructor(options) {
    this.SecondChallengeContainer = new PIXI.Container()
    this.SecondChallengeContainer.alpha = 0
    this.SecondChallengeContainer.interactive = true
    STORAGE.SecondChallengeClass = this
    STORAGE.SecondChallengeContainer = this.SecondChallengeContainer
    STORAGE.canvasStage.addChild(this.SecondChallengeContainer)

    document.querySelector('.webGLRenderer').classList.add('hidden')
    document.querySelector('.canvasRenderer').classList.remove('hidden')

    STORAGE.renderCanvas = true

    this.time

    this.assets = {}

    this.background
    this.conclusionBackground

    this.sum
    this.container = new PIXI.Container()
    this.stepIndex = 0

    this.recompenseButton = document.querySelector('.js-first-recompense-button')
    this.recompenseButtonLine = document.querySelector('.js-first-recompense-button-underLine')
    STORAGE.recompenseButtonLine = this.recompenseButtonLine

    this.conclusionChallengeText = document.querySelector('.js-conclusion-p')
    this.conclusionChallengeButton = document.querySelector('.js-first-recompense-button')
    this.conclusionChallengeTextContainer = document.querySelector('.js-conclusion-text-container')
    STORAGE.conclusionChallengeTextContainer = this.conclusionChallengeTextContainer

    this.conclusionChallengeText.innerHTML = conclusionTextsDatas.secondChallenge.conclusion
    this.conclusionChallengeButton.innerText = conclusionTextsDatas.secondChallenge.button

    this.entrance = true

    this.init()
  }

  bind() {
    let that = this
    this.SecondChallengeContainer.mousemove = function(mouseData){
      that.onMouseMove(mouseData)
    }
    this.recompenseButton.addEventListener('mouseover', that.handleRecompenseButtonMouseOver)
    this.recompenseButton.addEventListener('mouseout', that.handleRecompenseButtonMouseOut)
    this.recompenseButton.addEventListener('click', that.handleRecompenseButtonClick)

    setTimeout(function(){
      document.addEventListener("mousemove", that.handleMove)
    }, 2000)

  }

  unbind() {

    STORAGE.SecondChallengeClass.mask.clear()

    let that = this
    this.SecondChallengeContainer.mousemove = null

    this.recompenseButton.removeEventListener('mouseover', that.handleRecompenseButtonMouseOver)
    this.recompenseButton.removeEventListener('mouseout', that.handleRecompenseButtonMouseOut)
    this.recompenseButton.removeEventListener('click', that.handleRecompenseButtonClick)

    window.removeEventListener('resize', that.handleResize)

    document.removeEventListener("mousemove", that.handleMove)

    document.querySelector('.webGLRenderer').classList.remove('hidden')
    document.querySelector('.canvasRenderer').classList.add('hidden')
    STORAGE.renderCanvas = false
  }

  init() {
    let that = this

    if (STORAGE.loader.secondChallenge) {
      STORAGE.loader.resources = STORAGE.loader.secondChallenge
      this.setupSecondChallengePicturesLoaded()
    } else {
      STORAGE.loaderClass.loadSecondChallengePictures([
        'assets/second-challenge/step_0.png',
        'assets/second-challenge/step_1.png',
        'assets/second-challenge/step_2.png',
        'assets/second-challenge/step_3.png',
        'assets/second-challenge/step_4.png',
        'assets/second-challenge/step_5.png',
        'assets/second-challenge/step_6.png',
        'assets/global/fond-conclusion2.png'
      ])
    }

    TweenLite.set(STORAGE.canvasStage, {
      alpha: 1
    })
    TweenLite.to(this.SecondChallengeContainer, 2, {
      alpha: 1,
      ease: Power4.easeInOut
    })
    window.addEventListener('resize', that.handleResize)
  }

  setupSecondChallengePicturesLoaded() {
    this.assets.resources = STORAGE.loader.resources

    this.createMask()
    this.manageSounds()
    this.createBackground()
    this.createConclusionBackground()
    this.createSum()
    this.createGlobalBackground()
  }

  manageSounds(kill) {
    let that = this
    if (this.entrance) {
      STORAGE.soundManagerClass.lowerAmbiance(STORAGE.soundManagerClass.ambiance)
      setTimeout(function() {
        STORAGE.soundManagerClass.launchVoiceOver(soundBank.voiceOver.secondChallenge)
      }, 2000)
      setTimeout(function(){
        that.bind()
      }, 7500)
      this.entrance = false
      return
    }
  }

  createMask() {
    this.mask = new PIXI.Graphics()
    this.mask.beginFill(0xFFFFFF)
    STORAGE.SecondChallengeContainer.addChild(this.mask)
  }

  createGlobalBackground() {

    this.gobalBackground = new PIXI.Sprite(this.assets.resources['assets/second-challenge/step_6.png'].texture)

    let ratioVerticalGlobal = window.innerHeight / this.gobalBackground.texture.height
    let ratioHorizontalGlobal = window.innerWidth / this.gobalBackground.texture.width
    if (ratioHorizontalGlobal < ratioVerticalGlobal) {
      this.gobalBackground.scale = new PIXI.Point(ratioVerticalGlobal, ratioVerticalGlobal)
      this.gobalBackground.x = - (this.gobalBackground.texture.width * this.gobalBackground.scale.x - window.innerWidth) / 2
    } else {
      this.gobalBackground.scale = new PIXI.Point(ratioHorizontalGlobal, ratioHorizontalGlobal)
      this.gobalBackground.y = - (this.gobalBackground.texture.height * this.gobalBackground.scale.x - window.innerHeight) / 2
    }

    this.gobalBackground.alpha = 0

    this.SecondChallengeContainer.addChild(this.gobalBackground)
  }

  createBackground() {

    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (that.stepIndex == 0 && index == 0) {
        that.background = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
      if (that.stepIndex == 1 && index == 1) {
        that.background = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
      if (that.stepIndex == 2 && index == 2) {
        that.background = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
      if (that.stepIndex == 3 && index == 3) {
        that.background = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
      if (that.stepIndex == 4 && index == 4) {
        that.background = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
      if (that.stepIndex == 5 && index == 5) {
        that.background = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
      if (that.stepIndex == 6 && index == 6) {
        that.background = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })

    let ratioVertical = window.innerHeight / STORAGE.SecondChallengeClass.background.texture.height
    let ratioHorizontal = window.innerWidth / STORAGE.SecondChallengeClass.background.texture.width
    if (ratioHorizontal < ratioVertical) {
      STORAGE.SecondChallengeClass.background.scale = new PIXI.Point(ratioVertical, ratioVertical)
      STORAGE.SecondChallengeClass.background.x = - (STORAGE.SecondChallengeClass.background.texture.width * STORAGE.SecondChallengeClass.background.scale.x - window.innerWidth) / 2
    } else {
      STORAGE.SecondChallengeClass.background.scale = new PIXI.Point(ratioHorizontal, ratioHorizontal)
      STORAGE.SecondChallengeClass.background.y = - (STORAGE.SecondChallengeClass.background.texture.height * STORAGE.SecondChallengeClass.background.scale.x - window.innerHeight) / 2
    }

    this.SecondChallengeContainer.addChild(this.background)
  }

  createConclusionBackground() {
    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 7) {
        that.conclusionBackground = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })

    this.conclusionBackground.width = window.innerWidth
    this.conclusionBackground.height = window.innerHeight

    this.conclusionBackground.alpha = 0

    this.SecondChallengeContainer.addChild(this.conclusionBackground)
  }

  createSum(stepIndex) {
    let that = this
    this.container.position.x = window.innerWidth / 2
    this.container.position.y = window.innerHeight / 2

    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (that.stepIndex == 0 && index == 1) {
        that.sum = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
      if (that.stepIndex == 1 && index == 2) {
        that.sum = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
      if (that.stepIndex == 2 && index == 3) {
        that.sum = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
      if (that.stepIndex == 3 && index == 4) {
        that.sum = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
      if (that.stepIndex == 4 && index == 5) {
        that.sum = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
      if (that.stepIndex == 5 && index == 6) {
        that.sum = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })

    this.sum.scale = this.background.scale
    this.sum.x = this.sum.x
    this.sum.y = this.sum.y

    this.sum.anchor.x = 0.5
    this.sum.anchor.y = 0.5
    this.container.addChild(this.sum)
    this.container.mask = this.mask
    this.SecondChallengeContainer.addChild(this.container)
  }

  handleMove(e) {
    STORAGE.SecondChallengeClass.mask.beginFill()
    STORAGE.SecondChallengeClass.mask.drawCircle(e.x, e.y, 100, 0, 2 * Math.PI)
    STORAGE.SecondChallengeClass.mask.endFill()
  }

  handleResize() {
    STORAGE.canvasRenderer.resize(window.innerWidth, window.innerHeight)
    let timeOut
    clearTimeout(timeOut)
    timeOut = setTimeout(()=> {

      let ratioVerticalGlobal = window.innerHeight / STORAGE.SecondChallengeClass.gobalBackground.texture.height
      let ratioHorizontalGlobal = window.innerWidth / STORAGE.SecondChallengeClass.gobalBackground.texture.width
      if (ratioHorizontalGlobal < ratioVerticalGlobal) {
        STORAGE.SecondChallengeClass.gobalBackground.scale = new PIXI.Point(ratioVerticalGlobal, ratioVerticalGlobal)
        STORAGE.SecondChallengeClass.gobalBackground.x = - (STORAGE.SecondChallengeClass.gobalBackground.texture.width * STORAGE.SecondChallengeClass.gobalBackground.scale.x - window.innerWidth) / 2
      } else {
        STORAGE.SecondChallengeClass.gobalBackground.scale = new PIXI.Point(ratioHorizontalGlobal, ratioHorizontalGlobal)
        STORAGE.SecondChallengeClass.gobalBackground.y = - (STORAGE.SecondChallengeClass.gobalBackground.texture.height * STORAGE.SecondChallengeClass.gobalBackground.scale.x - window.innerHeight) / 2
      }

      let ratioVertical = window.innerHeight / STORAGE.SecondChallengeClass.background.texture.height
      let ratioHorizontal = window.innerWidth / STORAGE.SecondChallengeClass.background.texture.width
      if (ratioHorizontal < ratioVertical) {
        STORAGE.SecondChallengeClass.background.scale = new PIXI.Point(ratioVertical, ratioVertical)
        STORAGE.SecondChallengeClass.background.x = - (STORAGE.SecondChallengeClass.background.texture.width * STORAGE.SecondChallengeClass.background.scale.x - window.innerWidth) / 2
      } else {
        STORAGE.SecondChallengeClass.background.scale = new PIXI.Point(ratioHorizontal, ratioHorizontal)
        STORAGE.SecondChallengeClass.background.y = - (STORAGE.SecondChallengeClass.background.texture.height * STORAGE.SecondChallengeClass.background.scale.x - window.innerHeight) / 2
      }

      STORAGE.SecondChallengeClass.container.position.x = window.innerWidth / 2
      STORAGE.SecondChallengeClass.container.position.y = window.innerHeight / 2

      STORAGE.SecondChallengeClass.sum.scale = STORAGE.SecondChallengeClass.background.scale
      STORAGE.SecondChallengeClass.sum.x = STORAGE.SecondChallengeClass.sum.x
      STORAGE.SecondChallengeClass.sum.y = STORAGE.SecondChallengeClass.sum.y



      STORAGE.SecondChallengeClass.conclusionBackground.width = window.innerWidth
      STORAGE.SecondChallengeClass.conclusionBackground.height = window.innerHeight

    }, 200)
  }

  allCheckpointsChecked() {
    this.stepIndex++

    let that = this
    document.removeEventListener("mousemove", this.handleMove)

    if (this.stepIndex <= 5) {
      TweenLite.to(this.gobalBackground, 1, {
        alpha: 1,
        ease: Power2.easeInOut,
        onComplete: () => {
          this.createBackground()
          this.createSum()

          this.SecondChallengeContainer.addChild(this.gobalBackground)

          TweenLite.to(this.gobalBackground, 1, {
            alpha: 0,
            ease: Power2.easeInOut
          })

          STORAGE.SecondChallengeClass.mask.clear()
          STORAGE.SecondChallengeClass.mask.beginFill()
          STORAGE.SecondChallengeClass.mask.drawCircle(0, 0, 10, 0, 2 * Math.PI)
          STORAGE.SecondChallengeClass.mask.endFill()
          STORAGE.SecondChallengeClass.container.mask = STORAGE.SecondChallengeClass.mask

          if (this.stepIndex != 5) {
            setTimeout(function() {
              document.addEventListener("mousemove", that.handleMove)
            }, 1000)
          }
        }
      })

      let that = this
      if (this.stepIndex == 5) {
        STORAGE.soundManagerClass.launchInteractionSound(soundBank.interaction.interaction1, 3)

        setTimeout(function() {
          TweenLite.to(that.gobalBackground, 1, {
            alpha: 1,
            delay : 1
          })
          TweenLite.to([that.sum, that.background, that.container], 0.8, {
            alpha: 0,
            delay: 2,
            onComplete: () => {
              that.container.destroy()
              that.background.destroy()
              that.showConclusion()
            }
          })
        }, 2000)
      }
    }
  }

  onMouseMove(mouseData) {
    this.isWellErased(mouseData)
  }

  isWellErased(mouseData) {
    if (mouseData.data.global.x <= window.innerWidth*2 / 10 && mouseData.data.global.y <= window.innerHeight*2 / 10  && this.stepIndex == 0) {
      this.firstCheckpointChecked = true
    }
    if (mouseData.data.global.x <= window.innerWidth*2 / 10 && mouseData.data.global.y >= window.innerHeight*8 / 10  && this.stepIndex == 0) {
      this.secondCheckpointChecked = true
    }
    if (mouseData.data.global.x >= window.innerWidth*8 / 10 && mouseData.data.global.y <= window.innerHeight*2 / 10  && this.stepIndex == 0) {
      this.thirdCheckpointChecked = true
    }
    if (mouseData.data.global.x >= window.innerWidth*8 / 10 && mouseData.data.global.y >= window.innerHeight*8 / 10  && this.stepIndex == 0) {
      this.fourthCheckpointChecked = true
    }
    if (mouseData.data.global.x >= window.innerWidth/2 - 100 && mouseData.data.global.y <= window.innerWidth/2 + 100  && this.stepIndex == 0) {
      this.fifthCheckpointChecked = true
    }


    if (mouseData.data.global.x <= window.innerWidth*3.5 / 10 && mouseData.data.global.y <= window.innerHeight*2 / 10  && this.stepIndex == 1) {
      this.firstCheckpointChecked = true
    }
    if (mouseData.data.global.x <= window.innerWidth*3.5 / 10 && mouseData.data.global.y >= window.innerHeight*8 / 10  && this.stepIndex == 1) {
      this.secondCheckpointChecked = true
    }
    if (mouseData.data.global.x >= window.innerWidth*6.5 / 10 && mouseData.data.global.y <= window.innerHeight*2 / 10  && this.stepIndex == 1) {
      this.thirdCheckpointChecked = true
    }
    if (mouseData.data.global.x >= window.innerWidth*6.5 / 10 && mouseData.data.global.y >= window.innerHeight*8 / 10  && this.stepIndex == 1) {
      this.fourthCheckpointChecked = true
    }
    if (mouseData.data.global.x >= window.innerWidth/2 - 100 && mouseData.data.global.y <= window.innerWidth/2 + 100  && this.stepIndex == 1) {
      this.fifthCheckpointChecked = true
    }


    if (mouseData.data.global.x <= window.innerWidth*4.5 / 10 && mouseData.data.global.y <= window.innerHeight*2 / 10  && this.stepIndex == 2) {
      this.firstCheckpointChecked = true
    }
    if (mouseData.data.global.x <= window.innerWidth*4.5 / 10 && mouseData.data.global.y >= window.innerHeight*8 / 10  && this.stepIndex == 2) {
      this.secondCheckpointChecked = true
    }
    if (mouseData.data.global.x >= window.innerWidth*5.5 / 10 && mouseData.data.global.y <= window.innerHeight*2 / 10  && this.stepIndex == 2) {
      this.thirdCheckpointChecked = true
    }
    if (mouseData.data.global.x >= window.innerWidth*5.5 / 10 && mouseData.data.global.y >= window.innerHeight*8 / 10  && this.stepIndex == 2) {
      this.fourthCheckpointChecked = true
    }
    if (mouseData.data.global.x >= window.innerWidth/2 - 100 && mouseData.data.global.y <= window.innerWidth/2 + 100  && this.stepIndex == 2) {
      this.fifthCheckpointChecked = true
    }


    if (mouseData.data.global.x <= window.innerWidth*4.5 / 10 && mouseData.data.global.y <= window.innerHeight*1 / 10  && this.stepIndex == 3) {
      this.firstCheckpointChecked = true
    }
    if (mouseData.data.global.x <= window.innerWidth*4.5 / 10 && mouseData.data.global.y >= window.innerHeight*5 / 10  && this.stepIndex == 3) {
      this.secondCheckpointChecked = true
    }
    if (mouseData.data.global.x >= window.innerWidth*5.5 / 10 && mouseData.data.global.y <= window.innerHeight*1 / 10  && this.stepIndex == 3) {
      this.thirdCheckpointChecked = true
    }
    if (mouseData.data.global.x >= window.innerWidth*5.5 / 10 && mouseData.data.global.y >= window.innerHeight*5 / 10  && this.stepIndex == 3) {
      this.fourthCheckpointChecked = true
    }
    if (mouseData.data.global.x >= window.innerWidth/2 - 100 && mouseData.data.global.y <= window.innerWidth/2 + 100  && this.stepIndex == 3) {
      this.fifthCheckpointChecked = true
    }


    if (mouseData.data.global.x <= window.innerWidth*4.75 / 10 && mouseData.data.global.y <= window.innerHeight*1 / 10  && this.stepIndex == 4) {
      this.firstCheckpointChecked = true
    }
    if (mouseData.data.global.x <= window.innerWidth*4.75 / 10 && mouseData.data.global.y >= window.innerHeight*9 / 10  && this.stepIndex == 4) {
      this.secondCheckpointChecked = true
    }
    if (mouseData.data.global.x >= window.innerWidth*5.25 / 10 && mouseData.data.global.y <= window.innerHeight*1 / 10  && this.stepIndex == 4) {
      this.thirdCheckpointChecked = true
    }
    if (mouseData.data.global.x >= window.innerWidth*5.25 / 10 && mouseData.data.global.y >= window.innerHeight*9 / 10  && this.stepIndex == 4) {
      this.fourthCheckpointChecked = true
    }
    if (mouseData.data.global.x >= window.innerWidth/2 - 100 && mouseData.data.global.y <= window.innerWidth/2 + 100  && this.stepIndex == 4) {
      this.fifthCheckpointChecked = true
    }


    if (this.firstCheckpointChecked == true && this.secondCheckpointChecked == true && this.thirdCheckpointChecked == true && this.fourthCheckpointChecked == true && this.fifthCheckpointChecked == true) {
      this.allCheckpointsChecked()
      this.firstCheckpointChecked = false
      this.secondCheckpointChecked = false
      this.thirdCheckpointChecked = false
      this.fourthCheckpointChecked = false
      this.fifthCheckpointChecked = false
    }
  }

  showConclusion() {
    setTimeout(function() {
      STORAGE.soundManagerClass.launchVoiceOver(soundBank.voiceOver.secondChallengeRecompense)
    }, 1500)

    TweenLite.set(this.conclusionChallengeTextContainer, {
      display: 'block'
    })
    TweenLite.to(this.background, 0.3, {
      alpha: 0,
      delay: 1
    })
    TweenLite.to([this.conclusionBackground, this.conclusionChallengeTextContainer], 2, {
      autoAlpha: 1,
      alpha: 1,
      delay: 1
    })

    console.log(this.conclusionBackground)
    this.displayRecompenseButton()
  }

  displayRecompenseButton() {
    TweenLite.to([this.recompenseButton, this.recompenseButtonLine], 1.2, {
      autoAlpha: 1
    })
  }

  handleRecompenseButtonMouseOver() {
    TweenLite.to(STORAGE.recompenseButtonLine, 0.2, {
      width: '15%'
    })
  }

  handleRecompenseButtonMouseOut() {
    TweenLite.to(STORAGE.recompenseButtonLine, 0.2, {
      width: '7%'
    })
  }

  handleRecompenseButtonClick() {

    STORAGE.soundManagerClass.launchInteractionSound(soundBank.interaction.interactionCarousel, 1.5)

    STORAGE.SecondChallengeClass.undDisplayRecompenseButton()

    TweenLite.to([STORAGE.conclusionChallengeTextContainer], 0.5, {
      autoAlpha: 0,
      delay: 1
    })

    setTimeout(function(){
      new Recompense({ number: 2})
    }, 1000)

    setTimeout(function(){
      STORAGE.SecondChallengeContainer.destroy()
      STORAGE.SecondChallengeClass.unbind()
      STORAGE.SecondChallengeContainer = null
      STORAGE.conclusionChallengeTextContainer = null
      STORAGE.SecondChallengeClass = null
    }, 3000)

  }

  undDisplayRecompenseButton() {
    TweenLite.to([this.recompenseButton, this.recompenseButtonLine], 1.2, {
      autoAlpha: 0,
      onComplete: () => {
        TweenLite.set(this.conclusionChallengeTextContainer, {
          display: 'none'
        })
      }
    })
  }

}

export default SecondChallenge
