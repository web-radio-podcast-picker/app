// start view task

startViewTask = {

    canvas: null,       // canvas for visualization

    init(canvas) {
        this.canvas = canvas;
    },

    run() {
        const drawContext = this.canvas.getContext('2d');
        // clear view
        const canvasHeight = this.canvas.height;
        const canvasWidth = this.canvas.width;
        drawContext.clearRect(0, 0, canvasWidth, canvasHeight);
    }
}