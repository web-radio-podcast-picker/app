// signal measures view
class SignalMeasuresView {

    channel = null;     // channel

    init(channel, signalMeasures) {
        this.signalMeasures = signalMeasures;
        this.channel = channel;
    }

    run() {
        const c = this.channel.channelId;
        $('#csid_' + c).text(this.channel.sourceId);
        $('#ival_' + c).text(this.signalMeasures.value);
        $('#iv_' + c).text(this.signalMeasures.volts);
        $('#vmin_' + c).text(this.signalMeasures.vMin);
        $('#vmax_' + c).text(this.signalMeasures.vMax);
        $('#vavg_' + c).text(
            this.signalMeasures.vAvg == null ?
                '' :
                this.signalMeasures.vAvg.toFixed(7));

        $('#stime').text(oscilloscope.scanPeriod);
        $('#sfrq').text(oscilloscope.scanFrq);
        $('#buffsz').text(getSamplesTask.analyzer.frequencyBinCount);
        $('#echps').text(getSamplesTask.analyzer.context.sampleRate);
    }
}
