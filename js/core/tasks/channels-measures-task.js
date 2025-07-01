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
        // instant volt
        channel.measures.setValue(channel, d[0]);
        // min/max/avg
        var vMin = Number.MAX_VALUE;
        var vMax = Number.MIN_VALUE;
        var vAvg = 0;
        for (var i = 0; i < d.length; i++) {
            const v = d[i];
            vAvg += v;
            vMin = Math.min(vMin, v);
            vMax = Math.max(vMax, v);
        }
        if (d.length > 0)
            vAvg /= d.length;
        channel.measures.setMeasures(channel, vMin, vMax, vAvg);
    }
}