// start view task

startViewTask = {

    canvas: null,       // canvas for visualization

    init(canvas) {
        this.canvas = canvas;
    },

    run() {

        const o = oscilloscope;

        // time bounds
        o.lastStartTime = o.startTime;
        o.startTime = Date.now();
        if (o.lastStartTime != null) {
            o.scanPeriod = o.startTime - o.lastStartTime;
            o.scanFrq = (1000 / o.scanPeriod).toFixed(2);
        }

        // clear view
        const drawContext = this.canvas.getContext('2d');
        const canvasHeight = this.canvas.height;
        const canvasWidth = this.canvas.width;
        drawContext.clearRect(0, 0, canvasWidth, canvasHeight);

        app.startFrameOneShotOperations.forEach(fn => {
            fn();
        });
        app.startFrameOneShotOperations.length = 0;
    }
}