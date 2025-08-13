/*
    Sound card Oscilloscope | Spectrum Analyzer | Signal Generator
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// this is the main app body

app = {

    // properties

    audioInputChannel: null,    // audio input channel (shared)
    oscilloscope: null,         // oscilloscope channels manager
    oscilloscopeView: null,     // oscilloscope view
    gridView: null,             // grid view
    tasks: [],                  // tasks,
    canvas: null,               // canvas for visualization
    canvas_mk: null,            // canvas for markers
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
            this.onStartUI = () => { fn() }
        else {
            const f = this.onStartUI
            this.onStartUI = () => { fn(); f() }
        }
    },

    async run() {

        ui.init_intro()

        await this.checkAudio()

        this.oscilloscope = oscilloscope
        this.oscilloscopeView = new OscilloscopeView()
        this.gridView = new GridView()
        this.canvas = $('#cnv_oscillo')[0]
        this.canvas_mk = $('#cnv_markers')[0]
        this.gridView.init($('#cnv_grid')[0])
        this.audioInputChannel = await this.initDefaultAudioInput()
        this.oscilloscope.addChannel(this.audioInputChannel)
        this.initSettings()
        this.initUI()

        if (this.audioInputChannel != null &&
            this.audioInputChannel.error == null) this.start()
    },

    async checkAudio() {
        if (!navigator.mediaDevices?.enumerateDevices) {
            throw new Error("enumerateDevices() not supported.")
        } else {
            // List cameras and microphones.
            navigator.mediaDevices
                .enumerateDevices()
                .then((devices) => {
                    devices.forEach((device) => {
                        console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`)
                    })
                })
                .catch((err) => {
                    console.error(`${err.name}: ${err.message}`)
                })
        }
    },

    initSettings() {
        settings.sys.mobile = navigator.userAgentData.mobile
        settings.sys.platform =
            navigator.userAgentData.platform
        settings.sys.platformText = settings.sys.platform
            + (settings.sys.mobile ? ' mobile' : '')
    },

    initUI() {
        ui.init(this.oscilloscope)
    },

    startUI() {
        $(this.canvas).removeClass('canvas-uninitialized')
        // ui started event
        if (this.onStartUI != null) {
            const f = this.onStartUI
            this.onStartUI = null
            f()
        }
        // Setup a timer to visualize some stuff.
        this.requestAnimationFrame()
    },

    updateDisplay() {
        // update grid view
        // update non paused signals (data and view)
        // update paused signals (view only)
        this.startFrameOneShotOperations.push(() => {
            this.gridView.enableViewUpdate()
        })
        oscilloscope.refreshView()
    },

    async initDefaultAudioInput() {
        // build a channel for the default audio input device
        const channel = await oscilloscope.createChannel(
            Source_Id_AudioInput, audioInputDevice)
        return channel
    },

    start() {
        // setup the tasks
        channelsAnimationTask.init(this.oscilloscope)
        startViewTask.init(this.canvas)

        this.endFramePermanentOperations.push(() => {
            oscilloscope.frameEndCallback()
        })
        this.startFramePermanentOperations.push(() => {
            oscilloscope.frameStartCallback()
        })

        // grab & publish data
        this.tasks.push(this.task(getAnalyzersDataTasks))
        this.tasks.push(this.task(publishBuffersTasks))
        this.tasks.push(this.task(channelsMeasuresTask))

        // views tasks
        this.tasks.push(this.task(startFrameTask, this.mrr))            // frame start
        this.tasks.push(this.task(startViewTask, this.mrr))
        this.tasks.push(this.task(this.gridView, this.mrr))
        this.tasks.push(this.task(channelsAnimationTask, this.mrr))
        this.tasks.push(this.task(this.oscilloscopeView, this.mrr))

        // end of frame
        this.tasks.push(this.task(requestAnimationFrameTask))      // frame end

        this.startUI()
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
        return { task: task, rateLimitFunc: rateLimitFunc }
    },

    requestAnimationFrame: function () {

        const rlf = this.mrr
        const rateLimit = rlf != null && rlf != undefined
            ? (rlf == this.mrr ? this.mrr() : { value: null, data: null })
            : { value: null, delta: null }
        const t = this

        this.tasks.forEach(task => {
            const rlf = task.rateLimitFunc
            const hasRlf = rlf != null && rlf != undefined ? rlf == this.mrr : false
            if (!hasRlf || !rateLimit.value) {
                const fn = task.task
                requestAnimationFrame((() => fn.run(rateLimit)).bind(fn))
            }
        })
    },

    async setChannelSource(channel, sourceId) {
        if (channel.sourceId == sourceId) return
        switch (sourceId) {
            case Source_Id_AudioInput:
                await this.setChannelSourceAudioInput(channel)
                break
            case Source_Id_Ext:
                await this.setChannelSourceExt(channel)
                break
            case Source_Id_Generator:
                await this.setChannelSourceGenerator(channel)
                break
            case Source_Id_Math:
                await this.setChannelSourceMath(channel)
                break
        }
    },

    async setChannelSourceAudioInput(channel) {
        await oscilloscope.initChannelForSource(
            channel,
            Source_Id_AudioInput,
            audioInputDevice)
        this.audioInputChannel = channel
    },

    getInputChannel() {
        return this.audioInputChannel
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
            Source_Id_Math,
            null)
    },

    async addChannel() {
        const channel = await oscilloscope.createChannel(
            Source_Id_None, null)
        oscilloscope.addChannel(channel)
        this.initUI()
        this.requestAnimationFrame()
    },

    deleteChannel(channelId) {
        const channel = oscilloscope.getChannel(channelId)
        if (channel == null)
            console.error('channel not found', channelId)
        else {
            ui.channels.removeControls(channel)
            oscilloscope.removeChannel(channel)
            this.requestAnimationFrame()
        }
    },

    deleteAllChannels() {
        const t = [...oscilloscope.channels]
        t.forEach(channel => {
            this.deleteChannel(channel.channelId)
        })
        this.requestAnimationFrame()
    },

    toggleOPause() {
        if (oscilloscope.pause)
            // unpause immediately
            this.performTogglePause()
        else
            this.endFrameOneShotOperations.push(() => {
                // delay pause until end of frame
                this.performTogglePause()
            })
    },

    performTogglePause() {
        oscilloscope.pause = !oscilloscope.pause
        ui.channels.pauseAllOuts(oscilloscope.pause)
        ui.oscilloMenu.reflectOscilloPauseState()
        app.requestAnimationFrame()
    }

}

document.addEventListener('DOMContentLoaded', function () {
    if (settings.debug.trace)
        console.log('DOM fully loaded and parsed')
    app.run()
}, false)
