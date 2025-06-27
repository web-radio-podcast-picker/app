// this is the main app body

app = {

    // properties

    audioInputChannel: null,    // audio input channel (shared)
    oscilloscope: null,         // oscilloscope channels manager
    tasks: [],                  // tasks,
    canvas: null,               // canvas for visualization
    ui: null,                   // UI component

    // operations

    async run() {

        this.oscilloscope = oscilloscope;
        this.canvas = document.querySelector('canvas');
        this.audioInputChannel = await this.initDefaultAudioInput();
        this.oscilloscope.addChannel(this.audioInputChannel);
        this.initUI();

        if (this.audioInputChannel.error == null) this.start();
    },

    initUI() {
        ui.init(this.oscilloscope);
    },

    async initDefaultAudioInput() {
        // build a channel for the default audio input device
        const channel = await oscilloscope.createChannel(
            'audioInputDevice', audioInputDevice);
        channel.vScale = settings.audioInput.vScale;
        return channel;
    },

    start() {
        // setup tasks

        getSamplesTask.init(this.audioInputChannel.analyzer);
        channelsAnimationTask.init(this.oscilloscope);
        startViewTask.init(this.canvas);

        this.tasks.push(getSamplesTask);
        this.tasks.push(publishBuffersTasks);
        this.tasks.push(startViewTask);
        this.tasks.push(channelsAnimationTask);
        this.tasks.push(requestAnimationFrameTask);

        // Setup a timer to visualize some stuff.
        this.requestAnimationFrame();
    },

    requestAnimationFrame: function () {
        this.tasks.forEach(view => {
            requestAnimationFrame((() => view.run()).bind(view));
        });
    }

};

document.addEventListener('DOMContentLoaded', function () {
    if (settings.debug.trace)
        console.log('DOM fully loaded and parsed');
    app.run();
}, false);
