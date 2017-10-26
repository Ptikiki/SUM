const PIXI = require('pixi.js')

import Renderer from './components/Renderer.class.js'
import CanvasRenderer from './components/CanvasRenderer.class.js'
import Loader from './components/Loader.class.js'
import SoundManager from './components/SoundManager.class.js'
import Carousel from './components/Carousel.class.js'
import Menu from './components/Menu.class.js'
import FirstChallenge from './components/FirstChallenge.class.js'
import SecondChallenge from './components/SecondChallenge.class.js'
import ThirdChallenge from './components/ThirdChallenge.class.js'
import Video from './components/Video.class.js'
import Recompense from './components/Recompense.class.js'


window.STORAGE = {}
let startButton

window.onload = function() {
  startButton = document.querySelector('.js-launch-exp-button')
  bind()
}

function bind() {
  startButton.addEventListener('click', initCanvas)
}

function unbind() {
  startButton.removeEventListener('click', initCanvas)
}

function undisplayBackground() {
  let background = document.querySelector('.begining-container')
  TweenLite.to(background, 0.3, {
    autoAlpha: 0,
    onComplete: function() {
      TweenLite.set(background, {
        display: "none"
      })
    }
  })
}

function initCanvas() {

  unbind()
  undisplayBackground()

  STORAGE.renderCanvas = false

  new Renderer()
  new CanvasRenderer()
  new Loader()
  new Menu()
  new SoundManager()
  new Video({ number: 1 })
  // new Recompense({ number: 2 })
  // new Carousel({ number: 2 })

  render()
}

function render() {
  requestAnimationFrame(render)
  if (STORAGE.renderCanvas == false) {
    STORAGE.renderer.render(STORAGE.stage)
  } else if (STORAGE.renderCanvas == true) {

    STORAGE.canvasRenderer.render(STORAGE.canvasStage)
  }

}
