// signal measures view
class SignalMeasuresView {

    channel = null;     // channel

    init(channel, signalMeasures) {
        this.signalMeasures = signalMeasures;
        this.channel = channel;
    }

    run() {
        if (!this.channel.view.visible) return

        const c = this.channel.channelId;

        // channel gauges

        $('#csid_' + c).text(this.channel.sourceId);

        $('#iv_' + c).text(voltToText(this.signalMeasures.volts));
        $('#vmin_' + c).text(voltToText(this.signalMeasures.vMin));
        $('#vmax_' + c).text(voltToText(this.signalMeasures.vMax));

        $('#frq_' + c).text(this.signalMeasures.frq);
        $('#frqpe_' + c).text(tround(this.signalMeasures.frqPe));
        $('#frqmin_' + c).text(this.signalMeasures.frqMin);
        $('#frqmax_' + c).text(this.signalMeasures.frqMax);

        $('#vavg_' + c).text(
            this.signalMeasures.vAvg == null ?
                '' :
                vround7(this.signalMeasures.vAvg));

        $('#yscale_' + c).text(this.channel.yScale);
        $('#xscale_' + c).text(this.channel.xScale);
        $('#gain_' + c).text(vround(this.channel.gainValue))

        // channel controls (shortcuts)

        const $bout = $('#btn_chout_' + c)
        if (this.channel.out) {
            $bout.addClass('btn-bluegreen-on')
            $bout.removeClass('btn-bluegreen-off')
        } else {
            $bout.addClass('btn-bluegreen-off')
            $bout.removeClass('btn-bluegreen-on')
        }

        // channel settings panes

        if (this.channel == ui.getCurrentChannel())
            $('#opt_ch_trig_tv').text(voltToText(this.channel.trigger.triggeredV))
    }
}
