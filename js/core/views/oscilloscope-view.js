// oscilloscope view

class OscilloscopeView {

    run() {
        $('#stime').text(oscilloscope.scanPeriod);
        $('#sfrq').text(oscilloscope.scanFrq);
        $('#buffsz').text(getSamplesTask.analyzer.frequencyBinCount);
        $('#echps').text(oscilloscope.smFrq);
        $('#vdiv').text(vround(oscilloscope.vDiv) + 'V');
        $('#tdiv').text(tround(milli(oscilloscope.tDiv)) + 'ms');
    }

}