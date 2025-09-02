/*
    Web Radio | Podcast
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// signal measures view
class SignalMeasuresView {

    channel = null     // channel

    init(channel, signalMeasures) {
        this.signalMeasures = signalMeasures
        this.channel = channel
    }

    run() {
        if (!this.channel.view.visible) return

        const c = this.channel.channelId

        // channel gauges

        $('#csid_' + c).text(this.channel.sourceId)

        const iv = volt(this.signalMeasures.volts)
        $('#iv_' + c).text(voltToText(iv.value))
        $('#iv_u_' + c).text(iv.unit)

        const vmin = volt(this.signalMeasures.vMin)
        $('#vmin_' + c).text(voltToText(vmin.value))
        $('#vmin_u_' + c).text(vmin.unit)

        const vmax = volt(this.signalMeasures.vMax)
        $('#vmax_' + c).text(voltToText(vmax.value))
        $('#vmax_u_' + c).text(vmax.unit)

        $('#frqpe_' + c).text(tround(this.signalMeasures.frqPe))

        const frq = frequency(this.signalMeasures.frq)
        $('#frq_u_' + c).text(frq.unit)
        $('#frq_' + c).text(frq.value)

        const frqMin = frequency(this.signalMeasures.frqMin)
        $('#frqmin_u_' + c).text(frqMin.unit)
        $('#frqmin_' + c).text(frqMin.value)

        const frqMax = frequency(this.signalMeasures.frqMax)
        $('#frqmax_u_' + c).text(frqMax.unit)
        $('#frqmax_' + c).text(frqMax.value)

        const vAvg = volt(this.signalMeasures.vAvg)
        $('#vavg_' + c).text(vAvg.value)
        $('#vavg_u_' + c).text(vAvg.unit)

        $('#yscale_' + c).text(this.channel.yScale)
        $('#xscale_' + c).text(this.channel.xScale)
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
