// oscilloscope view

class OscilloscopeView {

    run() {
        //console.log(oscilloscope.frameFPS);
        $('#stime').text(oscilloscope.framePeriod);
        $('#sfrq').text(fround(oscilloscope.frameFPS));
        $('#buffsz').text(getSamplesTask.analyzer.frequencyBinCount);
        $('#echps').text(getSamplesTask.analyzer.context.sampleRate);
        $('#vdiv').text(vround(settings.oscilloscope.vPerDiv) + 'V');
        $('#tdiv').text(tround(settings.oscilloscope.tPerDiv) + 'ms');
    }

}