class CanvasRenderer {

    constructor(options) {
      this.canvasRenderer = new PIXI.CanvasRenderer(window.innerWidth, window.innerHeight, { antialias: true, clearBeforeRender: false })
      this.stage = new PIXI.Container()

      STORAGE.canvasRenderer = this.canvasRenderer
      STORAGE.canvasStage = this.stage

      this.init()
    }

    init() {
      this.canvasRenderer.backgroundColor = 0x000000
      this.canvasRenderer.autoClear = false
      this.canvasRenderer.autoResize = true
      this.canvasRenderer.view.classList.add('canvasRenderer')
      this.canvasRenderer.view.classList.add('hidden')
      document.body.appendChild(this.canvasRenderer.view)
    }
}

export default CanvasRenderer
