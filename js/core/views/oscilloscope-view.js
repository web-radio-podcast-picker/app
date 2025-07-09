// oscilloscope view

class OscilloscopeView {

    run() {
        $('#stime').text(oscilloscope.scanPeriod);
        $('#sfrq').text(oscilloscope.scanFrq);
        $('#buffsz').text(getSamplesTask.analyzer.frequencyBinCount);
        $('#echps').text(oscilloscope.smFrq);
        $('#vdiv').text(vround(settings.oscilloscope.vPerDiv) + 'V');
        $('#tdiv').text(tround(settings.oscilloscope.tPerDiv) + 'ms');
    }

}