// this is the main app body

app = {

    // properties

    audioInputChannel: null,    // audio input channel (shared)
    oscilloscope: null,         // oscilloscope channels manager
    oscilloscopeView: null,     // oscilloscope view
    gridView: null,             // grid view
    tasks: [],                  // tasks,
    canvas: null,               // canvas for visualization
    ui: null,                   // UI component
    powerOn: true,              // indicates if turned on or off

    // operations

    async run() {

        this.oscilloscope = oscilloscope;
        this.oscilloscopeView = new OscilloscopeView();
        this.gridView = new GridView();
        this.canvas = $('#cnv_oscillo')[0];
        this.gridView.init($('#cnv_grid')[0]);
        this.audioInputChannel = await this.initDefaultAudioInput();
        this.oscilloscope.addChannel(this.audioInputChannel);
        this.initUI();

        if (this.audioInputChannel != null &&
            this.audioInputChannel.error == null) this.start();
    },

    initUI() {
        ui.init(this.oscilloscope);
    },

    startUI() {
        $(this.canvas).removeClass('canvas-uninitialized');
        // Setup a timer to visualize some stuff.
        this.requestAnimationFrame();
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
        this.tasks.push(channelsMeasuresTask);
        this.tasks.push(startViewTask);
        this.tasks.push(this.gridView);
        this.tasks.push(channelsAnimationTask);
        this.tasks.push(this.oscilloscopeView);
        this.tasks.push(requestAnimationFrameTask);

        this.startUI();
    },

    requestAnimationFrame: function () {
        this.tasks.forEach(view => {
            requestAnimationFrame((() => view.run()).bind(view));
        });
    },

    async addChannel() {
        const channel = await oscilloscope.createChannel('audioInputDevice', audioInputDevice);
        oscilloscope.addChannel(channel);
        this.initUI();
        this.requestAnimationFrame();
    },

    deleteChannel(channelId) {
        const channel = oscilloscope.getChannel(channelId);
        if (channel == null)
            console.error('channel not found', channelId);
        else {
            ui.removeControls(channel);
            oscilloscope.removeChannel(channel);
            this.requestAnimationFrame();
        }
    },

    deleteAllChannels() {
        const t = [...oscilloscope.channels];
        t.forEach(channel => {
            this.deleteChannel(channel.channelId);
        });
        this.requestAnimationFrame();
    },

    togglePower() {
        if (this.powerOn) {
            this.deleteAllChannels();
            ui.turnOffMenu();
            this.powerOn = false;
        }
        else {
            window.location.reload(false);
        }
    },

    toggleOPause() {
        oscilloscope.pause = !oscilloscope.pause;
        ui.reflectOscilloPauseState();
        if (!oscilloscope.pause)
            app.requestAnimationFrame();
    }

};

document.addEventListener('DOMContentLoaded', function () {
    if (settings.debug.trace)
        console.log('DOM fully loaded and parsed');
    app.run();
}, false);

function vround(v) {
    return parseFloat(v.toFixed(5));
}