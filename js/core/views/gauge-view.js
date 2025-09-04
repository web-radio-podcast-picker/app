/*
    Web Radio | Podcast
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// signal view

class GaugeView {

    channel = null;          // channel

    init(channel) {
        this.channel = channel;
        this.$leftGauge = $('#wpr_left_gauge').find('.gauge-plot')
        this.$rightGauge = $('#wpr_right_gauge').find('.gauge-plot')
        this.plots = this.$leftGauge.length
    }

    run() {

        const dataArray = this.channel?.getSamplesTask?.fftDataArray;

        if (dataArray != null) {

            var value = dataArray[0];       // -1 .. 1

            var sum = 0
            for (var i = 0; i < dataArray.length; i += 1) {
                sum += dataArray[i]
            }
            var v = sum / dataArray.length
            const minDb = -130
            // limit to 0..minDb
            v = Math.max(v, minDb)
            if (v > 0) v = 0

            // 0..r-1     r..2*r-1      2*r .. 3*r-1    (#plots intervals)
            this.tplots(v, minDb, this.$leftGauge)
            this.tplots(v, minDb, this.$rightGauge)
        }
    }

    tplots(v, minDb, t) {
        var cv = minDb
        var i = this.plots - 1
        const r = -minDb / this.plots

        while (cv < 0) {
            // cv .. cv+r-1
            const e = t[i]
            const $e = $(e)
            if (v >= cv) {
                // plot on
                $e.addClass('gauge-plot-on')
            } else {
                // plot off
                $e.removeClass('gauge-plot-on')
            }
            cv += r
            i--
        }
    }

}
