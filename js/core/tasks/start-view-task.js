/*
    Sound card Oscilloscope Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// start view task

startViewTask = {

    canvas: null,       // canvas for visualization

    init(canvas) {
        this.canvas = canvas;
    },

    run() {

        // clear view
        const drawContext = this.canvas.getContext('2d');
        const canvasHeight = this.canvas.height;
        const canvasWidth = this.canvas.width;
        drawContext.clearRect(0, 0, canvasWidth, canvasHeight);

        app.startFramePermanentOperations.forEach(fn => {
            fn();
        });
        app.startFrameOneShotOperations.forEach(fn => {
            fn();
        });
        app.startFrameOneShotOperations.length = 0;
    }
}