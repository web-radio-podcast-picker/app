/*
    Sound card Oscilloscope Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// channels animation

channelsAnimationTask = {

    oscilloscope: null, // oscilloscope manager

    init(oscilloscope) {
        this.oscilloscope = oscilloscope;
    },

    run() {
        this.oscilloscope.channels.forEach(channel => {
            channel.view.run();
            channel.measuresView.run();
        });
    }
}