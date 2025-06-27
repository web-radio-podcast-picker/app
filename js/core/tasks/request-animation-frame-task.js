// request animation frame task (scan display end)

requestAnimationFrameTask = {

    run() {
        oscilloscope.endTime = Date.now();
        app.requestAnimationFrame();
    }

}
