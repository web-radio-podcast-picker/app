// request animation frame task (scan display end)

requestAnimationFrameTask = {

    run() {
        app.endFramePermanentOperations.forEach(fn => {
            fn();
        });
        app.endFrameOneShotOperations.forEach(fn => {
            fn();
        });
        app.endFrameOneShotOperations.length = 0;

        if (app.powerOn && !oscilloscope.pause)
            app.requestAnimationFrame();
    }

}
