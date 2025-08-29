/*
    Sound card Oscilloscope | Spectrum Analyzer | Signal Generator
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// publish buffers to oscilloscope views

publishBuffersTasks = {

    run() {
        oscilloscope.channels.forEach(channel => {
            // distribute audio input to listeners
            // or
            // use the get samples task from any analyser associated with the channel
            if ((!channel.pause
                && !oscilloscope.pause)
                || !channel.isDisplayed) {  // allows on demand updates
                if (channel.getSamplesTask != null) {
                    channel.getSamplesTask.run()
                    channel.measures.setData(
                        channel.getSamplesTask.dataArray,
                        channel.getSamplesTask.fftDataArray,
                        channel.getSamplesTask.sampleRate,
                        channel.getSamplesTask.channelCount,
                        channel.getSamplesTask.minDb,
                        channel.getSamplesTask.maxDb
                    )
                }
            }
        })
    }
}