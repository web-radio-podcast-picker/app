/*
    Sound card Oscilloscope | Signal Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// oscilloscope view

class OscilloscopeView {

    run() {
        $('#stime').text(pround(app.frameAvgPeriod * 1000));
        $('#sfrq').text(fround(app.frameAvgFPS));
        $('#buffsz').text(getSamplesTask.analyzer.frequencyBinCount);
        $('#echps').text(getSamplesTask.analyzer.context.sampleRate);
        $('#vdiv').text(vround(settings.oscilloscope.vPerDiv) + 'V');
        $('#tdiv').text(tround(settings.oscilloscope.tPerDiv) + 'ms');
    }

}