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
        const f = m.fftDataArray;

        // V instant
        channel.measures.setValue(channel, d[0]);

        // V min/max/avg
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

        // frequency
        var maxf = -Number.MAX_VALUE
        var maxi = null
        var n = f.length / m.channelCount
        if (f != null) {
            for (var i = 0; i < n; i++) {
                const v = f[i];
                if (v > maxf) {
                    maxf = v
                    maxi = i
                }
            }
        }

        var rt = n > 0 ? m.sampleRate / n : 0
        var frq = 0
        if (rt > 0) {
            frq = (rt / 2.0) * (maxi + 1)
        }

        channel.measures.setMeasures(
            channel,
            vMin,
            vMax,
            vAvg,
            frq);
    }
}