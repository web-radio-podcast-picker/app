// oscilloscope view

class OscilloscopeView {

    run() {
        $('#stime').text(oscilloscope.scanPeriod);
        $('#sfrq').text(oscilloscope.scanFrq);
        $('#buffsz').text(getSamplesTask.analyzer.frequencyBinCount);
        $('#echps').text(getSamplesTask.analyzer.context.sampleRate);
    }

}