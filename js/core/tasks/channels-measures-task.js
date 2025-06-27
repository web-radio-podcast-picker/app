// compute measures for channels from data buffer

channelsMeasuresTask = {

    run() {
        oscilloscope.channels.forEach(channel => {
            if (channel.measures.dataArray != null)
                this.compute(channel);
        });
    },

    compute(channel) {
        // compute properties from the data buffer
        const m = channel.measures;
        const d = m.dataArray;
        channel.measures.setValue(channel, d[0]);
        for (var i = 0; i < d.length; i++) {

        }
    }
}