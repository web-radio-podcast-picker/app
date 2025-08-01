/*
    Sound card Oscilloscope | Signal Analyzer Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// request animation frame task (scan display end)

requestAnimationFrameTask = {

    run(rateLimit) {
        if (!rateLimit.value) {
            app.endFramePermanentOperations.forEach(fn => {
                fn();
            });
            app.endFrameOneShotOperations.forEach(fn => {
                fn();
            });
            app.endFrameOneShotOperations.length = 0;
        }

        if (app.powerOn && !oscilloscope.pause)
            app.requestAnimationFrame();
    }

}
