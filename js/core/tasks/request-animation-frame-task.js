// request animation frame task (scan display end)

requestAnimationFrameTask = {

    run() {
        oscilloscope.endTime = Date.now();

        if (app.togglePauseRequested)
            app.performTogglePause();

        if (app.powerOn && !oscilloscope.pause)
            app.requestAnimationFrame();
    }

}
