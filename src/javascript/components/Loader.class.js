class Loader {

  constructor(options) {
    this.loader = PIXI.loader
    STORAGE.loaderClass = this
    STORAGE.loader = this.loader
  }

  loadCarouselPictures(pictures) {
    this.loader.resources = {}


    for (var i = 0; i < pictures.length; i++) {
      this.loader
      .add([pictures[i]])
    }
    this.loader
    .load(function(){
      STORAGE.carouselClass.setupCarouselPicturesLoaded()
    })

    if (STORAGE.carouselClass.carouselNumber == 1) {
      this.loader.carousel1 = this.loader.resources
    } else if (STORAGE.carouselClass.carouselNumber == 2) {
      this.loader.carousel2 = this.loader.resources
    } else if (STORAGE.carouselClass.carouselNumber == 3) {
      this.loader.carousel3 = this.loader.resources
    }

  }

  loadMenuPictures(pictures) {
    this.loader.resources = {}

    for (var i = 0; i < pictures.length; i++) {
      this.loader
      .add([pictures[i]])
    }

    this.loader
    .load(function(){
      STORAGE.MenuClass.setupMenuPicturesLoaded()
    })
  }

  loadFirstChallengePictures(pictures) {
    this.loader.resources = {}

    for (var i = 0; i < pictures.length; i++) {
      this.loader
      .add([pictures[i]])
    }

    this.loader
    .load(function(){
      STORAGE.FirstChallengeClass.setupFirstChallengePicturesLoaded()
    })

    this.loader.firstChallenge = this.loader.resources
  }

  loadSecondChallengePictures(pictures) {
    this.loader.resources = {}

    for (var i = 0; i < pictures.length; i++) {
      this.loader
      .add([pictures[i]])
    }

    this.loader
    .load(function(){
      STORAGE.SecondChallengeClass.setupSecondChallengePicturesLoaded()
    })

    this.loader.secondChallenge = this.loader.resources
  }

  loadThirdChallengePictures(pictures) {
    this.loader.resources = {}

    for (var i = 0; i < pictures.length; i++) {
      this.loader
      .add([pictures[i]])
    }

    this.loader
    .load(function(){
      STORAGE.ThirdChallengeClass.setupThirdChallengePicturesLoaded()
    })

    this.loader.thirdChallenge = this.loader.resources
  }

  loadVideoPictures(pictures) {
    this.loader.resources = {}

    for (var i = 0; i < pictures.length; i++) {
      this.loader
      .add([pictures[i]])
    }

    this.loader
    .load(function(){
      STORAGE.VideoClass.setupVideoPicturesLoaded()
    })
  }

  loadDeformationPictures(pictures) {
    this.loader.resources = {}

    for (var i = 0; i < pictures.length; i++) {
      this.loader
      .add([pictures[i]])
    }

    this.loader
    .load(function(){
      STORAGE.deformationClass.setupDeformationPicturesLoaded()
    })
  }

}

export default Loader
