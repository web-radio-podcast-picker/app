/*
    Sound card Oscilloscope | Spectrum Analyzer | Signal Generator
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// oscilloscope view

class OscilloscopeView {

    run() {
        $('#stime').text(pround(app.frameAvgPeriod * 1000))
        $('#sfrq').text(fround(app.frameAvgFPS))
        $('#vdiv').text(vround(settings.oscilloscope.vPerDiv) + 'V')
        $('#tdiv').text(tround(settings.oscilloscope.tPerDiv) + 'ms')
        const inChannel = app.getInputChannel()
        if (inChannel == null || inChannel.analyzer == null) return
        $('#buffsz').text(kilobyte(inChannel.analyzer.frequencyBinCount).text)
        $('#echps').text(kilo(inChannel.analyzer.context.sampleRate).text)
    }

}