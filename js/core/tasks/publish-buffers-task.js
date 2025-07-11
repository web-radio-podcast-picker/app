// publish buffers to oscilloscope views

publishBuffersTasks = {

    run() {
        oscilloscope.channels.forEach(channel => {
            if (channel.sourceId == Source_Id_AudioInput
                && !channel.view.pause
                && !oscilloscope.pause
            )
                channel.measures.setData(
                    [...getSamplesTask.dataArray]
                );
        });
    }
}