// oscilloscope manager

oscilloscope = {

    vPerDiv: 1,               // volts per division

    channels: [],             // array of channels

    audioContext: null,       // audio context for processing

    addChannel(channel) {
        // add a channel to the oscilloscope
        channel.view.init(app.canvas, channel);
        this.channels.push(channel);
    },

    async createChannel(sourceId, source) {

        // create a new channel and return it
        const channel = new Channel(this.channels.length + 1, sourceId);

        if (source != null || source != undefined) {

            // source provided
            channel.source = source;
            channel.stream = await channel.source.getMediaStream();
            this.audioContext = new AudioContext(); // not before getMediaStream

            if (channel.stream != undefined) {
                if (settings.debug.info)
                    console.log("Input media stream ok");

                channel.streamSource = this.audioContext.createMediaStreamSource(channel.stream);
                channel.analyzer = this.audioContext.createAnalyser();
                channel.streamSource.connect(channel.analyzer);

                if (settings.debug.info)
                    console.log("Input stream set", channel.analyzer);
            }
            else {
                channel.error = "No input media stream";
                console.error(channel.error);
            }

        } else {
            // dynamic source from classname (sourceId)
        }

        return channel;
    }
}
