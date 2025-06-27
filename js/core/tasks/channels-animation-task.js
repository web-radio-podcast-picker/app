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