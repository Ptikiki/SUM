const PIXI = require('pixi.js')
const FILTERS = require('pixi-filters')

class ImageDeformation {

  constructor(options) {
    this.deformationContainer = new PIXI.Container()
    this.deformationContainer.alpha = 0
    STORAGE.deformationClass = this
    STORAGE.deformation = this.deformationContainer

    this.number = options.number

    this.assets = {}

    this.image

    this.angle = 'up'
    this.displacement = 'up'

    this.animateBool = true

    this.twist
    this.displacementFilter
    this.blurFilter

    this.init()
  }

  init() {

    if (this.number == 1) {
      STORAGE.loaderClass.loadDeformationPictures([
        'assets/deformation/deformation-eye.jpg',
        'assets/deformation/displacement_map.png'
      ])
    } else if (this.number == 2) {
      STORAGE.loaderClass.loadDeformationPictures([
        'assets/deformation/deformation-masque.png',
        'assets/deformation/displacement_map.png'
      ])
    } else if (this.number == 3) {
      STORAGE.loaderClass.loadDeformationPictures([
        'assets/deformation/deformation-forme.png',
        'assets/deformation/displacement_map.png'
      ])
    }

  }

  setupDeformationPicturesLoaded() {
    this.replaceImage()

    this.doBlurFilter()
    this.doTwistFilter()
    this.doDisplacementFilter()
    this.image.filters = [
      this.displacementFilter,
      this.twist,
      this.blurFilter
    ]
    let that = this
    TweenLite.to(this.deformationContainer, 2, {
      alpha: 1,
      ease: Power3.easeInOut,
      delay: 0.6
    })
    this.animate(that)
  }

  replaceImage() {
    this.assets.resources = STORAGE.loader.resources

    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 0) {
        that.image = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })

    this.image.scale = new PIXI.Point(STORAGE.ratioHorizontal, STORAGE.ratioHorizontal)

    this.deformationContainer.addChild(this.image)

    STORAGE.stage.addChild(this.deformationContainer)

    this.deformationContainer.position.x -=  this.image.width / 4
    this.deformationContainer.position.y -=  this.image.height / 4
  }

  doBlurFilter() {
    this.blurFilter = new PIXI.filters.BlurFilter()
    this.blurFilter.blur = 0
  }

  doTwistFilter() {
    this.twist = new FILTERS.TwistFilter()
    this.twist.radius = window.innerWidth / 2.5
		this.twist.angle = 0
		this.twist.offset = [window.innerWidth / 2, window.innerHeight / 2]
  }

  doDisplacementFilter() {
    let that = this
    Object.keys(this.assets.resources).map(function(objectKey, index) {
      if (index == 1) {
        that.displacementSprite = new PIXI.Sprite(that.assets.resources[objectKey].texture)
      }
    })
    this.displacementSprite.scale = new PIXI.Point(2, 2)
    this.displacementSprite.position.y -= this.displacementSprite.height / 4
    this.displacementSprite.position.x -= this.displacementSprite.width / 4
		this.deformationContainer.addChild(this.displacementSprite)

    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite)
    this.displacementFilter.scale.x = 160
    this.displacementFilter.scale.y = 160
  }

  animate(that) {
    let it = that

    let requestID = window.requestAnimationFrame(function() {
      setTimeout(function() {
        it.animateBool = false
        return
      }, 9000)

      if (it.animateBool) {
        it.animate(it);
      }
    })

    if (that.animateBool == false) {
      window.cancelAnimationFrame(requestID)
      that.animateBool = true
    }

    if (this.twist.angle < -10) {
      this.angle = 'up'
    } else if (this.twist.angle > 10){
      this.angle = 'low'
    }

    if (this.angle == 'low') {
      this.twist.angle -= 0.01
    } else {
      this.twist.angle += 0.01
    }

    if (this.displacementSprite.x < -700) {
      this.displacement = 'up'
    } else if (this.displacementSprite.x > 700){
      this.displacement = 'low'
    }

    if (this.displacement == 'low') {
      this.displacementSprite.x -= 15
      this.displacementSprite.y -= 15
    } else {
      this.displacementSprite.x += 15
      this.displacementSprite.y += 15
    }

   if (this.displacementFilter.scale.x < 600) {
      this.displacementFilter.scale.x += 0.5
      this.displacementFilter.scale.y += 0.5
    }

    this.image.filters = [
      this.displacementFilter,
      this.twist,
      this.blurFilter
		]

  }
}

export default ImageDeformation
