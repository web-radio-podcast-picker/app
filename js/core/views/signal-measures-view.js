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
        //$('#ival_' + c).text(this.signalMeasures.value);

        $('#iv_' + c).text(voltToText(this.signalMeasures.volts));
        $('#vmin_' + c).text(voltToText(this.signalMeasures.vMin));
        $('#vmax_' + c).text(voltToText(this.signalMeasures.vMax));

        $('#vavg_' + c).text(
            this.signalMeasures.vAvg == null ?
                '' :
                vround7(this.signalMeasures.vAvg));

        $('#yscale_' + c).text(this.channel.yScale);
        $('#xscale_' + c).text(this.channel.xScale);
    }
}
