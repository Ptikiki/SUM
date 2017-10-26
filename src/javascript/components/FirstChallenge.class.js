import conclusionTextsDatas from '../datas/conclusionTexts.js'
import frames from '../datas/frames.js'
import soundBank from '../datas/soundBank.js'
import Recompense from './Recompense.class.js'
import TweenLite from 'gsap'

class FirstChallenge {

  constructor(options) {
    this.FirstChallengeContainer = new PIXI.Container()
    this.FirstChallengeContainer.alpha = 0
    STORAGE.FirstChallengeClass = this
    STORAGE.FirstChallengeContainer = this.FirstChallengeContainer
    STORAGE.stage.addChild(this.FirstChallengeContainer)

    this.assets = {}

    this.background
    this.eye = new PIXI.Graphics
    this.pathBasic = new PIXI.Graphics
    this.pathPassed = new PIXI.Graphics
    this.cursor = new PIXI.Sprite()
    this.pupilEmpty = new PIXI.Graphics
    this.eyeIndex = 1
    this.movie
    this.movieIndex = 0
    this.soundPlaying

    this.actualCursorDistance
    this.rightCursorDistance
    this.isDragging = false

    this.pathStart = [window.innerWidth/5.5, window.innerHeight / 2 - 100]
    this.pathEnd = [window.innerWidth/5.5, window.innerHeight / 2 + 100]

    this.nextAnimButton = document.querySelector('.js-first-challenge-next')
    this.recompenseButton = document.querySelector('.js-first-recompense-button')
    this.recompenseButtonLine = document.querySelector('.js-first-recompense-button-underLine')
    STORAGE.recompenseButtonLine = this.recompenseButtonLine

    this.conclusionChallengeText = document.querySelector('.js-conclusion-p')
    this.conclusionChallengeButton = document.querySelector('.js-first-recompense-button')
    this.conclusionChallengeTextContainer = document.querySelector('.js-conclusion-text-container')

    this.firstChallengeNextButton = document.querySelector('.nextImg')
    this.firstChallengeNextText = document.querySelector('.nextText')
    STORAGE.conclusionChallengeTextContainer = this.conclusionChallengeTextContainer

    this.entrance = true

    this.init()
  }

  init() {
    if (STORAGE.loader.firstChallenge) {
      STORAGE.loader.resources = STORAGE.loader.firstChallenge
      this.setupFirstChallengePicturesLoaded()
    } else {
      STORAGE.loaderClass.loadFirstChallengePictures([
        'assets/global/fond-conclusion1et3.png',
        'assets/first-challenge/oeil.png',
        'assets/first-challenge/eye-cursor.png'
      ])
    }

    TweenLite.set(STORAGE.stage, {
      alpha: 1
    })
    TweenLite.to(this.FirstChallengeContainer, 2, {
      alpha: 1,
      ease: Power4.easeInOut
    })
  }

  bind() {
    let that = this
    this.cursor.mousedown = function(){
      that.onCursorMouseDown()
    }
    this.cursor.mouseover = function(){
      that.onCursorMouseOver()
    }
    this.cursor.mouseout = function(){
      that.onCursorMouseOut()
    }

    window.addEventListener('resize', that.handleResize)

    this.nextAnimButton.addEventListener('click', that.handleNextAnimButtonClick)
    this.recompenseButton.addEventListener('mouseover', that.handleRecompenseButtonMouseOver)
    this.recompenseButton.addEventListener('mouseout', that.handleRecompenseButtonMouseOut)
    this.recompenseButton.addEventListener('click', that.handleRecompenseButtonClick)
    this.firstChallengeNextButton.addEventListener('mouseover', that.firstChallengeNextButtonMouseOver)
    this.firstChallengeNextButton.addEventListener('mouseout', that.firstChallengeNextButtonMouseOut)
  }

  unbind() {
      let that = this
      this.cursor.mousedown = null
      this.cursor.mouseover = null
      this.cursor.mouseout = null

      window.removeEventListener('resize', that.handleResize)

      this.nextAnimButton.removeEventListener('click', that.handleNextAnimButtonClick)
      this.recompenseButton.removeEventListener('mouseover', that.handleRecompenseButtonMouseOver)
      this.recompenseButton.removeEventListener('mouseout', that.handleRecompenseButtonMouseOut)
      this.recompenseButton.removeEventListener('click', that.handleRecompenseButtonClick)
      this.firstChallengeNextButton.removeEventListener('mouseover', that.firstChallengeNextButtonMouseOver)
      this.firstChallengeNextButton.removeEventListener('mouseout', that.firstChallengeNextButtonMouseOut)

      STORAGE.FirstChallengeClass.undDisplayNextAnimButton()
    }

  setupFirstChallengePicturesLoaded() {
    this.assets.resources = STORAGE.loader.resources

    this.manageSounds()
    this.createBackground()
    this.createEye()
    this.createGif(this.movieIndex)
    this.createPupilEmpty()
    this.bind()
  }

  createBackground() {
    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 0) {
        that.background = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })

    let ratioVertical = window.innerHeight / this.background.texture.height
    let ratioHorizontal = window.innerWidth / this.background.texture.width
    if (ratioHorizontal < ratioVertical) {
      this.background.scale = new PIXI.Point(ratioVertical, ratioVertical)
      this.background.x = - (this.background.texture.width * this.background.scale.x - window.innerWidth) / 2
    } else {
      this.background.scale = new PIXI.Point(ratioHorizontal, ratioHorizontal)
      this.background.y = - (this.background.texture.height * this.background.scale.x - window.innerHeight) / 2
    }

    this.FirstChallengeContainer.addChild(this.background)
  }

  createEye() {
    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 1) {
        that.eye = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })

    let ratioHorizontalEye = window.innerWidth / this.eye.texture.width
    this.eye.scale = new PIXI.Point(ratioHorizontalEye, ratioHorizontalEye)

    this.eye.position.x = window.innerWidth / 2
    this.eye.position.y = window.innerHeight / 2
    this.eye.anchor.x = 0.5
    this.eye.anchor.y = 0.5

    this.FirstChallengeContainer.addChild(this.eye)
  }

  createPupilEmpty() {
    this.pupilEmpty.beginFill(0x040026, 1)
    this.pupilEmpty.drawCircle(0, 0, this.eye.height / 1.9)
    this.pupilEmpty.endFill()

    TweenLite.set(this.pupilEmpty, {
      alpha: 0
    })

    this.eye.addChild(this.pupilEmpty)

    this.conclusionChallengeText.innerHTML = conclusionTextsDatas.firstChallenge.conclusion
    this.conclusionChallengeButton.innerText = conclusionTextsDatas.firstChallenge.button
  }

  createGif(index) {
    this.framesArray = []


    if (index == 3) {
      for (let i = 1; i < 28; i++) {
        let val = i < 10 ? '0' + i : i
        let texture = PIXI.Texture.fromImage(frames[3] + val + '.png')
        this.framesArray.push(texture)
      }
    }
    else {
      for (let i = 1; i < 35; i++) {
        let val = i < 10 ? '0' + i : i
        let texture = PIXI.Texture.fromImage(frames[index] + val + '.png')
        this.framesArray.push(texture)
      }
    }

    this.movie = new PIXI.extras.AnimatedSprite(this.framesArray)
    this.movie.alpha = 0
    this.movie.anchor.set(0.5)
    this.movie.animationSpeed = 0.25
    TweenLite.to(this.movie, 2, { alpha: 1 })
    this.movie.play()
    this.eye.addChild(this.movie)
  }


  createPath() {
    this.pathBasic.beginFill(0xffffff)
    this.pathBasic.moveTo(this.pathStart[0], this.pathStart[1])
    this.pathBasic.lineStyle(2, 0xffffff)
    this.pathBasic.lineTo(this.pathEnd[0], this.pathEnd[1])
    this.pathBasic.endFill()
    this.FirstChallengeContainer.addChild(this.pathBasic)

    this.pathPassed.beginFill(0xFFFFFF);
    this.pathPassed.drawRect(this.pathEnd[0] - 1, this.pathEnd[1], 2, 1)

    this.cursor.pathPassed = 1
    this.cursor.pathBasic = 1

    this.FirstChallengeContainer.addChild(this.pathPassed)

    TweenLite.set([this.pathBasic, this.pathPassed], {
      alpha: 0
    })
    TweenLite.to(this.pathBasic, 0.6, {
      alpha: 0.3
    })
    TweenLite.to(this.pathPassed, 0.6, {
      alpha: 1
    })
  }

  createCursor() {
    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 2) {
        that.cursor.texture = that.assets.resources[objectKey].texture
      }
    })
    this.cursor.width = 126/2
    this.cursor.height = 68/2
    this.cursor.x = this.pathEnd[0] - this.cursor.width/2
    this.cursor.y = this.pathEnd[1]
    this.cursor.interactive = true // pour attribuer événements à this.cursor

    TweenLite.set(this.cursor, {
      alpha: 0
    })
    TweenLite.to(this.cursor, 0.6, {
      alpha: 1
    })
    this.FirstChallengeContainer.addChild(this.cursor)
  }

  displayNextAnimButton() {
    TweenLite.to(this.nextAnimButton, 0.6, {
      autoAlpha: 1
    })
  }

  undDisplayNextAnimButton() {
    TweenLite.to(this.nextAnimButton, 0.6, {
      autoAlpha: 0
    })
  }

  handleNextAnimButtonClick() {
    STORAGE.FirstChallengeClass.undDisplayNextAnimButton()
    STORAGE.FirstChallengeClass.backToBegining()

    console.log(STORAGE.FirstChallengeClass.movieIndex)
    if (STORAGE.FirstChallengeClass.movieIndex ==  0) {
      console.log(STORAGE.FirstChallengeClass.movieIndex)
      STORAGE.soundManagerClass.launchInteractionSound(soundBank.interaction.interaction1, 2.5)
    } else if (STORAGE.FirstChallengeClass.movieIndex ==  1) {
      STORAGE.soundManagerClass.launchInteractionSound(soundBank.interaction.interaction2, 2.5)
    } else if (STORAGE.FirstChallengeClass.movieIndex ==  2) {
      STORAGE.soundManagerClass.launchInteractionSound(soundBank.interaction.interaction3, 2.5)
    } else if (STORAGE.FirstChallengeClass.movieIndex ==  3) {
      STORAGE.soundManagerClass.launchInteractionSound(soundBank.interaction.interaction4, 2.5)
    }

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

    STORAGE.FirstChallengeClass.undDisplayRecompenseButton()

    TweenLite.to([STORAGE.FirstChallengeContainer, STORAGE.conclusionChallengeTextContainer], 0.5, {
      alpha: 0,
      delay: 1,
      onComplete: function() {
        TweenLite.set([STORAGE.FirstChallengeContainer, STORAGE.conclusionChallengeTextContainer], {
          display:'none'
        })
      }
    })
    TweenLite.to([STORAGE.stage], 0.4, {
      alpha: 0,
      onComplete: function() {
        setTimeout(function(){
          STORAGE.FirstChallengeContainer.destroy()
          STORAGE.FirstChallengeClass.unbind()
          STORAGE.FirstChallengeContainer = null
          STORAGE.conclusionChallengeTextContainer = null
          STORAGE.FirstChallengeClass = null
          new Recompense({ number: 1})
        }, 1000)
      },
      delay: 2
    })
  }

  undDisplayRecompenseButton() {
    TweenLite.to([this.recompenseButton, this.recompenseButtonLine], 1.2, {
      autoAlpha: 0
    })
  }

  onWindowMouseUp(that) {
    if (that.cursor && that.isDragging) {
      that.isDragging = false
      that.cursor.mousemove = null
      document.body.style.cursor = 'auto'
    }
  }

  onCursorMouseOver() {
    document.body.style.cursor = '-webkit-grabbing'
  }

  onCursorMouseOut() {
    if (!this.isDragging) {
      document.body.style.cursor = 'auto'
    }
  }

  onCursorMouseDown() {
    this.isDragging = true
    document.body.style.cursor = '-webkit-grabbing'

    let that = this
    this.cursor.mousemove = function(mouseData){
      that.onCursorMouseMove(mouseData)
    }
    window.addEventListener('mouseup', function(){
      that.onWindowMouseUp(that)
    })
  }

  onCursorMouseDown() {
    this.isDragging = true
    document.body.style.cursor = '-webkit-grabbing'

    let that = this
    this.cursor.mousemove = function(mouseData){
      that.onCursorMouseMove(mouseData)
    }
    window.addEventListener('mouseup', function(){
      that.onWindowMouseUp(that)
    })
  }

  onCursorMouseMove(mouseData) {
    if (this.cursor.y < this.pathEnd[1] && this.cursor.y > this.pathStart[1]) {
      this.onRotationActivated()
      this.cursor.y = mouseData.data.global.y
    }
    if (this.cursor.y >= this.pathEnd[1]) {
      this.cursor.y = this.pathEnd[1] - 1
    }
    if (this.cursor.y <= this.pathStart[1]) {
      this.cursor.y = this.pathStart[1] + 1
    }
  }

  onRotationActivated() {
    // Math.PI * 2 * 0.500 = 3.141592653589793 = 180deg
    if (this.cursor.y < this.pathEnd[1] && this.cursor.y > this.pathStart[1]) {
      this.actualCursorDistance = (this.cursor.y - this.pathStart[1]) * 3.141592653589793 / (this.pathEnd[1] - this.pathStart[1])
      this.rightCursorDistance = Math.abs(this.actualCursorDistance - 3.141592653589793)
    }
    TweenLite.set(this.eye, {
      rotation: -this.rightCursorDistance
    })
    TweenLite.set(this.movie, {
      rotation: this.rightCursorDistance * 2
    })
    this.pathPassed.clear()
    this.pathPassed.drawRect(this.pathEnd[0] - 1, this.pathEnd[1], 2,  this.cursor.y - this.pathEnd[1])

    // To avoid twisted image
    if (this.eye.rotation < 3.141592653589793 && this.cursor.y < this.pathStart[1] + 10 ) {
      TweenLite.to(this.eye, 0.3, {
        rotation: -3.141592653589793
      })
      TweenLite.to(this.movie, 0.3, {
        rotation: 3.141592653589793 * 2
      })
      this.displayNextAnimButton()
    }
    if (this.eye.rotation > 0 && this.cursor.y > this.pathEnd[1] - 10) {
      TweenLite.to(this.eye, 0.3, {
        rotation: 0
      })
    }
  }

  handleResize() {
    STORAGE.renderer.resize(window.innerWidth, window.innerHeight)
    let timeOut
    clearTimeout(timeOut)
    timeOut = setTimeout(()=> {

      let ratioVertical = window.innerHeight / STORAGE.FirstChallengeClass.background.texture.height
      let ratioHorizontal = window.innerWidth / STORAGE.FirstChallengeClass.background.texture.width
      if (ratioHorizontal < ratioVertical) {
        STORAGE.FirstChallengeClass.background.scale = new PIXI.Point(ratioVertical, ratioVertical)
        STORAGE.FirstChallengeClass.background.x = - (STORAGE.FirstChallengeClass.background.texture.width * STORAGE.FirstChallengeClass.background.scale.x - window.innerWidth) / 2
      } else {
        STORAGE.FirstChallengeClass.background.scale = new PIXI.Point(ratioHorizontal, ratioHorizontal)
        STORAGE.FirstChallengeClass.background.y = - (STORAGE.FirstChallengeClass.background.texture.height * STORAGE.FirstChallengeClass.background.scale.x - window.innerHeight) / 2
      }

      let ratioHorizontalEye = window.innerWidth / STORAGE.FirstChallengeClass.eye.texture.width
      STORAGE.FirstChallengeClass.eye.scale = new PIXI.Point(ratioHorizontalEye, ratioHorizontalEye)

      STORAGE.FirstChallengeClass.eye.position.x = window.innerWidth / 2
      STORAGE.FirstChallengeClass.eye.position.y = window.innerHeight / 2
      STORAGE.FirstChallengeClass.eye.anchor.x = 0.5
      STORAGE.FirstChallengeClass.eye.anchor.y = 0.5

    }, 200)
  }

  manageSounds(kill) {
    let that = this
    if (this.entrance) {
      STORAGE.soundManagerClass.lowerAmbiance(STORAGE.soundManagerClass.ambiance)
      STORAGE.soundManagerClass.stopMurmure(STORAGE.soundManagerClass.murmure)
      setTimeout(function() {
        STORAGE.soundManagerClass.launchVoiceOver(soundBank.voiceOver.firstChallenge)
      }, 2000)
      setTimeout(function(){
        that.createPath()
        that.createCursor()
      }, 10000)
      this.entrance = false
      return
    }
  }

  backToBegining() {
    let that = this

    if (this.movieIndex < 3) {
      TweenLite.to(this.eye, 0.6, {
        rotation: 0
      })
      TweenLite.to(this.movie, 0.3, {
        alpha: 0,
        onComplete: function() {
          that.eye.removeChild(that.movie)
          that.movieIndex ++
          that.createGif(that.movieIndex)
        }
      })
      this.pathPassed.clear()
      TweenLite.to(this.cursor, 0.3, {
        y: this.pathEnd[1]
      })

      if (this.movieIndex == 2) {
        TweenLite.set(that.firstChallengeNextText, {
          display: 'none'
        })
      }
    } else {
      this.eye.removeChild(that.movie)
      this.showConclusion()
    }
  }

  firstChallengeNextButtonMouseOver() {
    let nextButtonCircle = this.querySelector('.buttonCircle')
    let nextButtonArrow = this.querySelector('.buttonArrow')

    TweenLite.to([nextButtonCircle], 0.3, {
      fill: "#BBBEE2",
    })
    TweenLite.to([nextButtonArrow], 0.3, {
      stroke: "white"
    })
  }

  firstChallengeNextButtonMouseOut() {
    let nextButtonCircle = this.querySelector('.buttonCircle')
    let nextButtonArrow = this.querySelector('.buttonArrow')

    TweenLite.to([nextButtonCircle], 0.3, {
      fill: "transparent",
    })
    TweenLite.to([nextButtonArrow], 0.3, {
      stroke: "#BBBEE2"
    })
  }

  showConclusion() {

    setTimeout(function() {
      STORAGE.soundManagerClass.launchVoiceOver(soundBank.voiceOver.firstChallengeRecompense)
    }, 1500)

    TweenLite.to([this.cursor, this.pathBasic, this.pathPassed, this.pupilEmpty, this.eye], 0.6, {
      alpha: 0
    })

    TweenLite.set(this.conclusionChallengeTextContainer, {
      display: "block"
    })

    TweenLite.to(this.conclusionChallengeTextContainer, 2, {
      autoAlpha: 1,
      delay: 1
    })
    this.displayRecompenseButton()
  }

}

export default FirstChallenge
