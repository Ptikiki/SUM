import conclusionTextsDatas from '../datas/conclusionTexts.js'
import soundBank from '../datas/soundBank.js'
import Recompense from './Recompense.class.js'
import TweenLite from 'gsap'

class ThirdChallenge {

  constructor(options) {
    this.ThirdChallengeContainer = new PIXI.Container()
    this.ThirdChallengeContainer.alpha = 0
    STORAGE.ThirdChallengeClass = this
    STORAGE.ThirdChallengeContainer = this.ThirdChallengeContainer
    STORAGE.stage.addChild(this.ThirdChallengeContainer)

    this.assets = {}

    this.background
    this.conclusionBackground
    this.helpButton = new PIXI.Graphics()
    this.shape
    this.isDragging = false
    this.keepDoing = true

    this.interactionSoundLaunched = false

    this.thirdChallengeHtmlElements = document.querySelector('.js-third-challenge')
    this.thirdChallengeHelpInformations = document.querySelector('.js-third-challenge-interactions')
    this.thirdChallengeHelpInformations.state = 0
    this.checkpoint = document.querySelector('.js-third-challenge-checkpointText')

    this.recompenseButton = document.querySelector('.js-first-recompense-button')
    this.recompenseButtonLine = document.querySelector('.js-first-recompense-button-underLine')
    STORAGE.recompenseButtonLine = this.recompenseButtonLine

    this.conclusionChallengeText = document.querySelector('.js-conclusion-p')
    this.conclusionChallengeButton = document.querySelector('.js-first-recompense-button')
    this.conclusionChallengeTextContainer = document.querySelector('.js-conclusion-text-container')
    STORAGE.conclusionChallengeTextContainer = this.conclusionChallengeTextContainer

    this.conclusionChallengeText.innerHTML = conclusionTextsDatas.thirdChallenge.conclusion
    this.conclusionChallengeButton.innerText = conclusionTextsDatas.thirdChallenge.button

    this.entrance = true

    this.init()
  }

  init() {
    let that = this

    if (STORAGE.loader.thirdChallenge) {
      STORAGE.loader.resources = STORAGE.loader.thirdChallenge
      this.setupThirdChallengePicturesLoaded()
    } else {
      STORAGE.loaderClass.loadThirdChallengePictures([
        'assets/third-challenge/fond.jpg',
        'assets/third-challenge/rectangle.png',
        'assets/third-challenge/circle.png',
        'assets/third-challenge/triangle.png',
        'assets/third-challenge/line.png',
        'assets/third-challenge/half-circle.png',
        'assets/third-challenge/aide.svg',
        'assets/global/fond-conclusion1et3.png'
      ])
    }

    TweenLite.set(STORAGE.stage, {
      alpha: 1
    })
    TweenLite.to(this.ThirdChallengeContainer, 2, {
      alpha: 1,
      ease: Power4.easeInOut
    })
    TweenLite.to(this.thirdChallengeHtmlElements, 0.8, {
      autoAlpha: 1,
      ease: Power2.easeInOut,
      delay: 1.8
    })

    window.addEventListener('resize', that.handleResize)
  }

  bind() {
    let that = this
    this.rectangle.mouseover = function(){ that.onShapeMouseOver() }
    this.rectangle.mouseout = function(){ that.onShapeMouseOut() }
    this.rectangle.mousedown = function(mouseData){ that.onShapeMouseDown(mouseData, this) }
    this.circle.mouseover = function(){ that.onShapeMouseOver() }
    this.circle.mouseout = function(){ that.onShapeMouseOut() }
    this.circle.mousedown = function(mouseData){ that.onShapeMouseDown(mouseData, this) }
    this.triangle.mouseover = function(){ that.onShapeMouseOver() }
    this.triangle.mouseout = function(){ that.onShapeMouseOut() }
    this.triangle.mousedown = function(mouseData){ that.onShapeMouseDown(mouseData, this) }
    this.line.mouseover = function(){ that.onShapeMouseOver() }
    this.line.mouseout = function(){ that.onShapeMouseOut() }
    this.line.mousedown = function(mouseData){ that.onShapeMouseDown(mouseData, this) }
    this.halfcircle.mouseover = function(){ that.onShapeMouseOver() }
    this.halfcircle.mouseout = function(){ that.onShapeMouseOut() }
    this.halfcircle.mousedown = function(mouseData){ that.onShapeMouseDown(mouseData, this) }
    this.helpButton.mousedown = function(mouseData){ that.onHelpButtonMouseDown(mouseData, this) }
    this.checkpoint.addEventListener('click', that.onCheckpointMouseDown)
    this.recompenseButton.addEventListener('mouseover', that.handleRecompenseButtonMouseOver)
    this.recompenseButton.addEventListener('mouseout', that.handleRecompenseButtonMouseOut)
    this.recompenseButton.addEventListener('click', that.handleRecompenseButtonClick)
  }

  unbind() {
    let that = this
    window.removeEventListener('resize', that.handleResize)
    this.rectangle.mouseover = null
    this.rectangle.mouseout = null
    this.rectangle.mousedown = null
    this.circle.mouseover = null
    this.circle.mouseout = null
    this.circle.mousedown = null
    this.triangle.mouseover = null
    this.triangle.mouseout = null
    this.triangle.mousedown = null
    this.line.mouseover = null
    this.line.mouseout = null
    this.line.mousedown = null
    this.halfcircle.mouseover = null
    this.halfcircle.mouseout = null
    this.halfcircle.mousedown = null
    this.helpButton.mousedown = null
    this.checkpoint.removeEventListener('click', that.onCheckpointMouseDown)
    this.recompenseButton.removeEventListener('mouseover', that.handleRecompenseButtonMouseOver)
    this.recompenseButton.removeEventListener('mouseout', that.handleRecompenseButtonMouseOut)
    this.recompenseButton.removeEventListener('click', that.handleRecompenseButtonClick)

    TweenLite.to(this.thirdChallengeHtmlElements, 0.3, {
      autoAlpha: 0
    })
  }

  onShapeMouseOver() {
    document.body.style.cursor = '-webkit-grabbing'
  }

  onShapeMouseOut() {
    if (!this.isDragging) {
      document.body.style.cursor = 'auto'
    }
  }

  onShapeMouseDown(mouseData, shape) {
    let that = this
    this.shape = shape

    this.shape.stroke = 0xff0a00;
    this.shape.strokeThickness = 24;

    this.isDragging = true
    this.mouseX = mouseData.data.global.x
    this.mouseY = mouseData.data.global.y
    document.body.style.cursor = '-webkit-grabbing'

    this.shape.mousemove = function(mouseData){
      that.onShapeMouseMove(mouseData)
    }
    window.addEventListener('mouseup', function(){
      that.onWindowMouseUp(that)
    })

    window.addEventListener('keydown', function(key) { that.onKeyDown(key, that.shape)})
    //this.backtoBeginning(that.shape)
  }

  onShapeMouseMove(mouseData) {
    this.newMouseX = mouseData.data.global.x
    this.newMouseY = mouseData.data.global.y
    this.shape.x += this.newMouseX - this.mouseX
    this.shape.y += this.newMouseY - this.mouseY
    this.mouseX = this.newMouseX
    this.mouseY = this.newMouseY
  }

  onWindowMouseUp(that) {
    if (that.shape && that.isDragging) {
      that.isDragging = false
      that.shape.mousemove = null
      document.body.style.cursor = 'auto'
    }
  }

  onKeyDown(key, shape) {
    if (key.keyCode === 82) {
      this.onShapeRotation(shape)
    }
    else if (key.keyCode === 90) {
      this.onShapeZoom(shape)
    }
    else if (key.keyCode === 65) {
      this.onShapeDezoom(shape)
    }
  }

  onShapeRotation(shape) {
    TweenLite.to(shape, 0.3, {
      rotation: "+=" + 1
    })
  }

  onShapeZoom(shape) {
    TweenLite.to(shape, 0.3, {
      width: "+=" + 25,
      height: "+=" + 25
    })
  }

  onShapeDezoom(shape) {
    TweenLite.to(shape, 0.3, {
      width: "-=" + 25,
      height: "-=" + 25
    })
  }

  backtoBeginning(shape) {

    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 1) {
        that.drawRectangle()
      }
      else if (index == 2) {
        that.drawCircle()
      }
      else if (index == 3) {
        that.drawTriangle()
      }
      else if (index == 4) {
        that.drawLine()
      }
      else if (index == 5) {
        that.drawHalfcircle()
      }
    })

/*  if (shape.graphicsData[0].shape.constructor.name == 'Circle') { that.drawCircle() }
    else if (shape.graphicsData[0].shape.constructor.name == 'Rectangle') { that.drawRectangle() }
    else if (shape.graphicsData[0].shape.constructor.name == 'Polygon') { that.drawTriangle() }
*/
    this.bind()
  }

  onCheckpointMouseDown() {

    if (STORAGE.ThirdChallengeClass.interactionSoundLaunched == false) {
      STORAGE.soundManagerClass.launchInteractionSound(soundBank.interaction.interaction1, 3)
      STORAGE.ThirdChallengeClass.interactionSoundLaunched = true
    }

    setTimeout(function(){
      STORAGE.ThirdChallengeClass.keepDoing = false
    }, 3500)

    STORAGE.ThirdChallengeClass.drawRandomCircle(STORAGE.ThirdChallengeClass.circle.width)
    STORAGE.ThirdChallengeClass.drawRandomRectangle(STORAGE.ThirdChallengeClass.rectangle.width, STORAGE.ThirdChallengeClass.rectangle.height)
    STORAGE.ThirdChallengeClass.drawRandomTriangle(STORAGE.ThirdChallengeClass.triangle.width, STORAGE.ThirdChallengeClass.triangle.height)
    STORAGE.ThirdChallengeClass.drawRandomLine(STORAGE.ThirdChallengeClass.line.width, STORAGE.ThirdChallengeClass.line.height)
    STORAGE.ThirdChallengeClass.drawRandomHalfcircle(STORAGE.ThirdChallengeClass.halfcircle.width, STORAGE.ThirdChallengeClass.halfcircle.height)

    if(STORAGE.ThirdChallengeClass.keepDoing == true) {
      setTimeout(function(){
        STORAGE.ThirdChallengeClass.onCheckpointMouseDown()
      }, 100)
    }
    else {
      setTimeout(function(){
        STORAGE.ThirdChallengeClass.showConclusion()
      }, 3500)
      return
    }
  }

  setupThirdChallengePicturesLoaded() {
    this.assets.resources = STORAGE.loader.resources

    this.createBackground()
    this.createConclusionBackground()
    this.manageSounds()
    this.drawRectangle()
    this.drawCircle()
    this.drawTriangle()
    this.drawLine()
    this.drawHalfcircle()
    this.drawHelpButton()
  }

  manageSounds(kill) {
    let that = this
    if (this.entrance) {
      STORAGE.soundManagerClass.lowerAmbiance(STORAGE.soundManagerClass.ambiance)
      setTimeout(function() {
        STORAGE.soundManagerClass.launchVoiceOver(soundBank.voiceOver.thirdChallenge)
      }, 2000)
      setTimeout(function(){
        that.bind()
      }, 10000)
      this.entrance = false
      return
    }
  }

  createBackground() {
    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 0) {
        that.background = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })

    this.background.width = window.innerWidth
    this.background.height = window.innerHeight

    this.ThirdChallengeContainer.addChild(this.background)
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

    this.ThirdChallengeContainer.addChild(this.conclusionBackground)
  }

  drawRectangle() {
    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 1) {
        that.rectangle = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })
    this.rectangle.width = 715/20
    this.rectangle.height = 1063/20
    this.rectangle.x = window.innerWidth-window.innerWidth/8*5
    this.rectangle.y = window.innerHeight-this.rectangle.height-30
    this.rectangle.anchor.set(0.5)
    this.rectangle.interactive = true
    this.ThirdChallengeContainer.addChild(this.rectangle)
  }

  drawRandomRectangle(width, height) {
    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 1) {
        that.randomRectangle = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })
    this.randomRectangle.width = width
    this.randomRectangle.height = height
    this.randomRectangle.x = window.innerWidth-Math.random()*window.innerWidth
    this.randomRectangle.y = window.innerHeight-Math.random()*window.innerHeight
    this.randomRectangle.anchor.set(0.5)
    TweenLite.to(this.randomRectangle, 0.5, {
      rotation: "+="+3
    })
    this.ThirdChallengeContainer.addChild(this.randomRectangle)
  }

  drawCircle() {
    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 2) {
        that.circle = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })
    this.circle.width = 1069/20
    this.circle.height = 1069/20
    this.circle.x = window.innerWidth-window.innerWidth/8*3
    this.circle.y = window.innerHeight-this.circle.height-30
    this.circle.anchor.set(0.5)
    this.circle.interactive = true
    this.ThirdChallengeContainer.addChild(this.circle)
  }

  drawRandomCircle(width) {
    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 2) {
        that.randomCircle = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })
    this.randomCircle.width = width
    this.randomCircle.height = this.randomCircle.width
    this.randomCircle.x = window.innerWidth-Math.random()*window.innerWidth
    this.randomCircle.y = window.innerHeight-Math.random()*window.innerHeight
    this.randomCircle.anchor.set(0.5)
    TweenLite.to(this.randomCircle, 0.5, {
      rotation: "+="+3
    })
    this.ThirdChallengeContainer.addChild(this.randomCircle)
  }

  drawTriangle() {
    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 3) {
        that.triangle = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })
    this.triangle.width = 1920/20
    this.triangle.height = 962/20
    this.triangle.x = window.innerWidth-window.innerWidth/8*6
    this.triangle.y = window.innerHeight-this.triangle.height-30
    this.triangle.anchor.set(0.5)
    this.triangle.interactive = true
    this.ThirdChallengeContainer.addChild(this.triangle)
  }

  drawRandomTriangle(width, height) {
    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 3) {
        that.randomTriangle = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })
    this.randomTriangle.width = width
    this.randomTriangle.height = height
    this.randomTriangle.x = window.innerWidth-Math.random()*window.innerWidth
    this.randomTriangle.y = window.innerHeight-Math.random()*window.innerHeight
    this.randomTriangle.anchor.set(0.5)
    TweenLite.to(this.randomTriangle, 0.5, {
      rotation: "-="+3
    })
    this.ThirdChallengeContainer.addChild(this.randomTriangle)
  }

  drawLine() {
    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 4) {
        that.line = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })
    this.line.width = 1056/20
    this.line.height = 1064/20
    this.line.x = window.innerWidth-window.innerWidth/8*4
    this.line.y = window.innerHeight-this.line.height-30
    this.line.anchor.set(0.5)
    this.line.interactive = true
    this.ThirdChallengeContainer.addChild(this.line)
  }

  drawRandomLine(width, height) {
    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 4) {
        that.randomLine = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })
    this.randomLine.width = width
    this.randomLine.height = height
    this.randomLine.x = window.innerWidth-Math.random()*window.innerWidth
    this.randomLine.y = window.innerHeight-Math.random()*window.innerHeight
    this.randomLine.anchor.set(0.5)
    TweenLite.to(this.randomLine, 0.5, {
      rotation: "-="+3
    })
    this.ThirdChallengeContainer.addChild(this.randomLine)
  }

  drawHalfcircle() {
    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 5) {
        that.halfcircle = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })
    this.halfcircle.width = 532/20
    this.halfcircle.height = 1065/20
    this.halfcircle.x = window.innerWidth-window.innerWidth/8*2
    this.halfcircle.y = window.innerHeight-this.halfcircle.height-30
    this.halfcircle.anchor.set(0.5)
    this.halfcircle.interactive = true
    this.ThirdChallengeContainer.addChild(this.halfcircle)
  }

  drawRandomHalfcircle(width, height) {
    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 5) {
        that.randomHalfcircle = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })
    this.randomHalfcircle.width = width
    this.randomHalfcircle.height = height
    this.randomHalfcircle.x = window.innerWidth-Math.random()*window.innerWidth
    this.randomHalfcircle.y = window.innerHeight-Math.random()*window.innerHeight
    this.randomHalfcircle.anchor.set(0.5)
    TweenLite.to(this.randomHalfcircle, 0.5, {
      rotation: "+="+3
    })
    this.ThirdChallengeContainer.addChild(this.randomHalfcircle)
  }

  drawHelpButton() {
    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 6) {
        that.helpButton = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })
    this.helpButton.width = 30
    this.helpButton.height = 30
    this.helpButton.x = 60
    this.helpButton.y = window.innerHeight-100
    this.helpButton.interactive = true
    this.ThirdChallengeContainer.addChild(this.helpButton)
  }

  handleResize() {
    STORAGE.renderer.resize(window.innerWidth, window.innerHeight)
    let timeOut
    clearTimeout(timeOut)
    timeOut = setTimeout(()=> {
      STORAGE.ThirdChallengeClass.background.width = window.innerWidth
      STORAGE.ThirdChallengeClass.background.height = window.innerHeight
      STORAGE.ThirdChallengeClass.rectangle.x = window.innerWidth-window.innerWidth/8*5
      STORAGE.ThirdChallengeClass.rectangle.y = window.innerHeight-STORAGE.ThirdChallengeClass.rectangle.height-30
      STORAGE.ThirdChallengeClass.circle.x = window.innerWidth-window.innerWidth/8*3
      STORAGE.ThirdChallengeClass.circle.y = window.innerHeight-STORAGE.ThirdChallengeClass.circle.height-30
      STORAGE.ThirdChallengeClass.triangle.x = window.innerWidth-window.innerWidth/8*6
      STORAGE.ThirdChallengeClass.triangle.y = window.innerHeight-STORAGE.ThirdChallengeClass.triangle.height-30
      STORAGE.ThirdChallengeClass.line.x = window.innerWidth-window.innerWidth/8*4
      STORAGE.ThirdChallengeClass.line.y = window.innerHeight-STORAGE.ThirdChallengeClass.line.height-30
      STORAGE.ThirdChallengeClass.halfcircle.x = window.innerWidth-window.innerWidth/8*2
      STORAGE.ThirdChallengeClass.halfcircle.y = window.innerHeight-STORAGE.ThirdChallengeClass.halfcircle.height-30
      STORAGE.ThirdChallengeClass.helpButton.y = window.innerHeight-100
    }, 200)
  }

  onHelpButtonMouseDown() {
    let that = this
    if (that.thirdChallengeHelpInformations.state == 0) {
      TweenLite.to(this.thirdChallengeHelpInformations, 0.6, {
        autoAlpha: 1
      })
      that.thirdChallengeHelpInformations.state = 1
    } else {
      TweenLite.to(this.thirdChallengeHelpInformations, 0.6, {
        autoAlpha: 0
      })
      that.thirdChallengeHelpInformations.state = 0
    }
  }

  displayRecompenseButton() {
    TweenLite.to(this.recompenseButton, 1.2, {
      autoAlpha: 1
    })
  }

  undDisplayRecompenseButton() {
    TweenLite.to(this.recompenseButton, 1.2, {
      autoAlpha: 0
    })
  }

  thirdChallengeEnding() {
    TweenLite.to([STORAGE.ThirdChallengeContainer, STORAGE.conclusionChallengeTextContainer], 0.5, {
      alpha: 0,
      display:'none',
      delay: 1
    })
    TweenLite.to([STORAGE.stage], 0.4, {
      alpha: 0,
      onComplete: function() {
        setTimeout(function(){
          STORAGE.ThirdChallengeContainer.destroy()
          STORAGE.ThirdChallengeClass.unbind()
          STORAGE.ThirdChallengeContainer = null
          STORAGE.conclusionChallengeTextContainer = null
          STORAGE.ThirdChallengeClass = null
          new ThirdRecompense()
        }, 1000)
      },
      delay: 2
    })

  }

  showConclusion() {
    setTimeout(function() {
      STORAGE.soundManagerClass.launchVoiceOver(soundBank.voiceOver.thirdChallengeRecompense)
    }, 1500)

    for(let i=0; i < this.ThirdChallengeContainer.children.length; i++) {
      if (this.ThirdChallengeContainer.children[i] != this.background && this.ThirdChallengeContainer.children[i] != this.conclusionBackground  )  {
        TweenLite.to(this.ThirdChallengeContainer.children[i], 0.8, {
          y: "+=" + 50,
          x: "+=" + 50,
          ease: Power4.easeInOut
        })

        TweenLite.to(this.ThirdChallengeContainer.children[i].scale, 0.8, {
          y: "+=" + 0.4,
          x: "+=" + 0.4,
          ease: Power4.easeInOut
        })
      }
    }

    TweenLite.to(this.background, 0.3, {
      alpha: 0,
      ease: Power2.easeInOut,
      onComplete: function() {
        STORAGE.ThirdChallengeClass.ThirdChallengeContainer.addChild(STORAGE.ThirdChallengeClass.background)
      }
    })

    TweenLite.to([this.helpButton, this.rectangle, this.triangle, this.circle, this.halfcircle, this.line, this.thirdChallengeHtmlElements], 0.6, {
      y: "+=" + 100,
      alpha: 0,
      ease: Power2.easeOut
    })

    TweenLite.to(this.background, 0.3, {
      alpha: 0,
      delay: 0.4,
      ease: Power2.easeIn,
      onComplete: function() {
        for(let i=0; i < STORAGE.ThirdChallengeClass.ThirdChallengeContainer.children.length; i++) {
          if (STORAGE.ThirdChallengeClass.ThirdChallengeContainer.children[i] != STORAGE.ThirdChallengeClass.background) {
            TweenLite.set(STORAGE.ThirdChallengeClass.ThirdChallengeContainer.children[i], {
              alpha: 0
            })
          }
        }
      }
    })
    TweenLite.set([this.background, this.conclusionBackground], {
      y: 0,
      delay: 1.7
    })

    TweenLite.set(this.conclusionChallengeTextContainer, {
      display: 'block',
    })
    TweenLite.to([this.conclusionBackground, this.conclusionChallengeTextContainer], 2, {
      autoAlpha: 1,
      alpha: 1,
      delay: 1,
    })

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

    STORAGE.ThirdChallengeClass.undDisplayRecompenseButton()

    TweenLite.to([STORAGE.ThirdChallengeContainer, STORAGE.conclusionChallengeTextContainer], 0.5, {
      alpha: 0,
      display:'none',
      delay: 1
    })
    TweenLite.to([STORAGE.stage], 0.4, {
      alpha: 0,
      onComplete: function() {
        setTimeout(function(){
          STORAGE.ThirdChallengeContainer.destroy()
          STORAGE.ThirdChallengeClass.unbind()
          STORAGE.ThirdChallengeContainer = null
          STORAGE.conclusionChallengeTextContainer = null
          STORAGE.ThirdChallengeClass = null
          new Recompense({ number: 3})
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

}

export default ThirdChallenge
