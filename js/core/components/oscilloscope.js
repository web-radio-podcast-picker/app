// oscilloscope manager

oscilloscope = {

    channels: [],             // array of channels
    audioContext: null,       // audio context for processing

    lastStartTime: null,      // last start time for visualization
    startTime: null,          // start time for visualization
    endTime: null,            // end time for visualization

    pause: false,             // pause on/off all channels

    scanPeriod: null,         // scan period (in ms, eg view period)
    scanFrq: null,            // scan frequency (in Hz, eg 1000 ms / view period)
    frameDuration: null,
    frameFPS: null,

    /*smTime: 0,                // sampling period
    smFrq: 0,  */               // sampling frequency
    /*sampleTime: 0,*/           // pixel time

    getChannel(channelId) {
        var r = null;
        // get a channel from channel id, null if not found
        this.channels.forEach(channel => {
            if (channel.channelId == channelId) {
                r = channel;
                return;
            }
        });
        return r;
    },

    removeChannel(channel) {
        const idx = this.channels.indexOf(channel);
        if (idx != -1) {
            this.channels.splice(idx, 1);
        }
        else
            console.error('channel not found', channel);
    },

    addChannel(channel) {
        // add a channel to the oscilloscope
        channel.view.init(app.canvas, channel);
        this.channels.push(channel);
        // add controls for the Channel
        ui.addControls(channel);
    },

    async createChannel(sourceId, source) {

        // create a new channel and return it
        var chId = 0;
        this.channels.forEach(channel => {
            chId = Math.max(chId, channel.channelId);
        });
        chId++;
        const channel = new Channel(chId, sourceId);

        if (source != null || source != undefined) {

            // source provided
            await this.initChannelFromSource(channel, source);

        } else {
            // dynamic source from classname (sourceId)
        }

        return channel;
    },

    async initChannelFromSource(channel, source) {
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
    },

    // NOT USED
    /*initSampleProps() {
        this.smFrq = getSamplesTask.analyzer.context.sampleRate;    // or oscilloscope.scanFrq
        if (this.smFrq == null || this.smFrq == 0) return 0;
        this.sampleTime = 1.0 / this.smFrq;
        const buffl = 1024;     // reference buffer length in samples
        this.bufferTime = buffl * this.sampleTime;    // buffer length in seconds
    },*/

    // auto time per division calculation (@obsolete)
    /*getTimePerDiv(canvasWidth, divw) {
        this.initSampleProps();
        // scale 1 pixel / 1 sample
        settings.oscilloscope.tPerDiv = this.sampleTime * divw * buffl / canvasWidth;
        return settings.oscilloscope.tPerDiv;
    },*/

    frameStartCallback() {
        // called at the start of the frame
        this.lastStartTime = this.startTime;
        this.startTime = Date.now();
    },

    frameEndCallback() {
        // called at the end of the frame        
        this.endTime = Date.now();
        this.frameDuration = this.endTime - this.startTime;
        this.frameFPS = 1000.0 / this.frameDuration; // Hz
        if (this.lastStartTime != null) {
            this.scanPeriod = this.startTime - this.lastStartTime;
            this.scanFrq = (1000 / this.scanPeriod).toFixed(2);
        }
    }
}
