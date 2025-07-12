// oscilloscope view

class OscilloscopeView {

    run() {
        $('#stime').text(app.frameAvgPeriod);
        $('#sfrq').text(fround(app.frameAvgFPS));
        $('#buffsz').text(getSamplesTask.analyzer.frequencyBinCount);
        $('#echps').text(getSamplesTask.analyzer.context.sampleRate);
        $('#vdiv').text(vround(settings.oscilloscope.vPerDiv) + 'V');
        $('#tdiv').text(tround(settings.oscilloscope.tPerDiv) + 'ms');
    }

}