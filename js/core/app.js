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

    onStartUI: null,            // ui started callback
    lastFrameStartTime: null,
    frameStartTime: null,
    endFramePermanentOperations: [], // end frame operations (always)
    endFrameOneShotOperations: [],   // end frame operations (single shot)
    startFramePermanentOperations: [], // start frame operations (always)
    startFrameOneShotOperations: [],     // start frame operations (single shot)

    frameAvgFPS: 0,
    frameAvgPeriod: 0,

    // operations

    addOnStartUI(fn) {
        if (this.onStartUI == null)
            this.onStartUI = () => { fn(); }
        else {
            const f = this.onStartUI;
            this.onStartUI = () => { fn(); f(); }
        }
    },

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
        // ui started event
        if (this.onStartUI != null) {
            const f = this.onStartUI;
            this.onStartUI = null;
            f();
        }
        // Setup a timer to visualize some stuff.
        this.requestAnimationFrame();
    },

    updateDisplay() {
        // update grid view
        // update non paused signals (data and view)
        // update paused signals (view only)
        this.startFrameOneShotOperations.push(() => {
            this.gridView.enableViewUpdate();
        });
        this.requestAnimationFrame();
    },

    async initDefaultAudioInput() {
        // build a channel for the default audio input device
        const channel = await oscilloscope.createChannel(
            Source_Id_AudioInput, audioInputDevice);
        return channel;
    },

    start() {
        // setup the tasks
        getSamplesTask.init(this.audioInputChannel.analyzer);
        channelsAnimationTask.init(this.oscilloscope);
        startViewTask.init(this.canvas);

        this.endFramePermanentOperations.push(() => {
            oscilloscope.frameEndCallback();
        })
        this.startFramePermanentOperations.push(() => {
            oscilloscope.frameStartCallback();
        })

        // grab data
        this.tasks.push(this.task(getSamplesTask));
        this.tasks.push(this.task(publishBuffersTasks));
        this.tasks.push(this.task(channelsMeasuresTask));

        // views tasks
        this.tasks.push(this.task(startFrameTask, this.mrr));            // frame start
        this.tasks.push(this.task(startViewTask, this.mrr));
        this.tasks.push(this.task(this.gridView, this.mrr));
        this.tasks.push(this.task(channelsAnimationTask, this.mrr));
        this.tasks.push(this.task(this.oscilloscopeView, this.mrr));

        // end of frame
        this.tasks.push(this.task(requestAnimationFrameTask));      // frame end

        this.startUI();
    },

    mrr() {
        // check to know if must limit the refresh rate
        if (!Number.isFinite(startFrameTask.frameFPS))
            return { value: false, delta: 0 }

        const tooFast = startFrameTask.frameFPS > settings.ui.maxRefreshRate
        const d = Date.now() - startFrameTask.frameStartTime
        const f = 1000.0 / d
        const lateEnough = f <= settings.ui.maxRefreshRate

        this.frameAvgFPS =
            Math.min(startFrameTask.frameFPS,
                Math.min(settings.ui.maxRefreshRate, f))
        this.frameAvgPeriod = 1.0 / this.frameAvgFPS

        return (tooFast && !lateEnough) ?
            {
                value: true,
                frameFPS: startFrameTask.frameFPS,
                frameAvgFPS: this.frameAvgFPS
            }
            : { value: false, delta: 0 }
    },

    task(task, rateLimitFunc) {
        return { task: task, rateLimitFunc: rateLimitFunc };
    },

    requestAnimationFrame: function () {

        const rlf = this.mrr;
        const rateLimit = rlf != null && rlf != undefined
            ? (rlf == this.mrr ? this.mrr() : { value: null, data: null })
            : { value: null, delta: null }
        const t = this

        this.tasks.forEach(task => {
            const rlf = task.rateLimitFunc
            const hasRlf = rlf != null && rlf != undefined ? rlf == this.mrr : false
            if (!hasRlf || !rateLimit.value) {
                const fn = task.task
                requestAnimationFrame((() => fn.run(rateLimit)).bind(fn));
            }
        });
    },

    async setChannelSource(channel, sourceId) {
        if (channel.sourceId == sourceId) return
        switch (sourceId) {
            case Source_Id_AudioInput:
                this.setChannelSourceAudioInput(channel)
                break;
            case Source_Id_Ext:
                this.setChannelSourceExt(channel)
                break;
            case Source_Id_Generator:
                this.setChannelSourceGenerator(channel)
                break;
            case Source_Id_Math:
                this.setChannelSourceMath(channel)
                break;
        }
    },

    async setChannelSourceAudioInput(channel) {
        await oscilloscope.initChannelForSource(
            channel,
            Source_Id_AudioInput,
            audioInputDevice)
    },

    async setChannelSourceExt(channel) {
    },

    async setChannelSourceGenerator(channel) {
        await oscilloscope.initChannelForGenerator(
            channel,
            Source_Id_Generator)
    },

    async setChannelSourceMath(channel) {
        await oscilloscope.initChannelForMath(
            channel,
            Source_Id_None,
            null)
    },

    async addChannel() {
        const channel = await oscilloscope.createChannel(
            Source_Id_None, null);
        oscilloscope.addChannel(channel);
        this.initUI();
        this.requestAnimationFrame();
    },

    deleteChannel(channelId) {
        const channel = oscilloscope.getChannel(channelId);
        if (channel == null)
            console.error('channel not found', channelId);
        else {
            ui.channels.removeControls(channel);
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

    // @TODO: NOT USED
    togglePower() {
        if (this.powerOn) {
            this.deleteAllChannels()
            ui.oscilloMenu.turnOffMenu()
            ui.closePopup()
            ui.inputWidgets.closeInputWidget()
            this.powerOn = false
            this.updateDisplay()
        }
        else {
            window.location.reload(false)
        }
    },

    toggleOPause() {
        if (oscilloscope.pause)
            // unpause immediately
            this.performTogglePause();
        else
            this.endFrameOneShotOperations.push(() => {
                // delay pause until end of frame
                this.performTogglePause();
            });
    },

    performTogglePause() {
        oscilloscope.pause = !oscilloscope.pause;
        ui.channels.pauseAllOuts(oscilloscope.pause)
        ui.oscilloMenu.reflectOscilloPauseState();
        if (!oscilloscope.pause)
            app.requestAnimationFrame();
    }

};

document.addEventListener('DOMContentLoaded', function () {
    if (settings.debug.trace)
        console.log('DOM fully loaded and parsed');
    app.run();
}, false);
