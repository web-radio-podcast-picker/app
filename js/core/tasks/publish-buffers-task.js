// publish buffers to oscilloscope views

publishBuffersTasks = {

    run() {
        oscilloscope.channels.forEach(channel => {
            if (channel.sourceId == Source_Id_AudioInput
                && ((!channel.pause
                    && !oscilloscope.pause)
                    || !channel.isDisplayed)
            )
                channel.measures.setData(
                    [...getSamplesTask.dataArray],
                    [...getSamplesTask.fftDataArray],
                    getSamplesTask.sampleRate,
                    getSamplesTask.channelCount,
                    getSamplesTask.minDb,
                    getSamplesTask.maxDb
                );
        });
    }
}