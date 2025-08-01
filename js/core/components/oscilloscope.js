/*
    Sound card Oscilloscope | Signal Analyzer Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// oscilloscope manager

// Start off by initializing a new context.
windowAudioContext = new (window.AudioContext || window.webkitAudioContext)();

oscilloscope = {

    channels: [],             // array of channels
    lastStartTime: null,      // last start time for visualization
    startTime: null,          // start time for visualization
    endTime: null,            // end time for visualization

    pause: false,             // pause on/off all channels

    scanPeriod: null,         // scan period (in ms, eg view period)
    scanFrq: null,            // scan frequency (in Hz, eg 1000 ms / view period)

    framePeriod: null,
    frameDuration: null,
    frameFPS: null,

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
        channel.view.init(app.canvas, channel)
        channel.fftView.init(app.canvas, channel)
        this.channels.push(channel)
        // add controls for the Channel
        ui.channels.addControls(channel)
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
            await this.initChannelForSource(channel, sourceId, source);

        } else {
            // dynamic source from classname (sourceId)
            // @TODO: NOT IMPLEMENTED
        }

        return channel;
    },

    initChannelForGenerator(channel, sourceId) {
        //windowAudioContext
        channel.deleteSource()
        channel.sourceId = sourceId
        channel.audioContext = new AudioContext()
        channel.gain = channel.audioContext.createGain()
        channel.setAnalyser(
            channel.audioContext.createAnalyser())

        channel.generator.init(
            channel,
            channel.audioContext.createOscillator()
        )

        channel.generator.oscillator.connect(channel.gain)
        channel.gain.connect(channel.analyzer)
        channel.gain.gain.value = 1       // gain 1

        channel.vScale = settings.output.vScale
        channel.generator.start()
        channel.getSamplesTask = new GetSamplesTask()
            .init(channel.analyzer)
    },

    setOut(channel, on) {
        try {
            if (channel != null && channel.analyzer != null) {
                if (on)
                    channel.analyzer.connect(channel.audioContext.destination)
                else
                    channel.analyzer.disconnect(channel.audioContext.destination)
                channel.outConnected = on
            }
        } catch (err) {
            if (settings.debug.debug)
                console.log(err)
        }
        channel.out = on
    },

    initChannelForMath(channel, sourceId) {
        channel.deleteSource()
        channel.sourceId = sourceId
    },

    initChannelForNone(channel) {
        channel.deleteSource()
        channel.sourceId = Source_Id_None
    },

    async initChannelForSource(channel, sourceId, source) {
        channel.deleteSource()
        channel.sourceId = sourceId
        channel.source = source
        if (channel.source != null)
            channel.stream = await channel.source.getMediaStream()
        if (sourceId == Source_Id_AudioInput)
            channel.vScale = settings.audioInput.vScale

        channel.audioContext = new AudioContext() // not before getMediaStream
        channel.gain = channel.audioContext.createGain()

        if (channel.stream != undefined) {
            if (settings.debug.info)
                console.log("Input media stream ok")

            channel.streamSource = channel.audioContext.createMediaStreamSource(channel.stream)
            channel.setAnalyser(
                channel.audioContext.createAnalyser())

            channel.streamSource.connect(channel.gain);
            channel.gain.connect(channel.analyzer);

            if (settings.debug.info)
                console.log("Input stream set", channel.analyzer)
        }
        else {
            channel.error = "No input media stream"
            console.error(channel.error)
        }
    },

    refreshView() {
        if (this.pause)
            app.requestAnimationFrame()
    },

    frameStartCallback() {
        // called at the start of the frame
        const lst = this.lastStartTime
        this.lastStartTime = this.startTime
        this.startTime = Date.now()
        if (lst != null) {
            this.framePeriod = this.startTime - lst;
            this.frameFPS = parseFloat((1000 / this.framePeriod).toFixed(2))
        }
    },

    frameEndCallback() {
        // called at the end of the frame        
        this.endTime = Date.now();
        this.frameDuration = this.endTime - this.startTime;
    }
}
