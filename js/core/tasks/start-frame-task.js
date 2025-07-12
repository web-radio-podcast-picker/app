// at begin of frame

startFrameTask = {

    lastFrameStartTime: null,
    frameStartTime: null,
    frameFPS: 0,
    frameDuration: 0,

    run() {
        const lst = this.lastFrameStartTime
        this.lastFrameStartTime = this.frameStartTime
        this.frameStartTime = Date.now()
        if (lst != null) {
            this.frameDuration = this.frameStartTime - lst
            //console.log(this.frameDuration)
            const fps = 1000.0 / this.frameDuration;
            this.frameFPS = fps;
        }
    }
}