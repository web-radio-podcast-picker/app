// channel

class Channel {

    channelId = null;           // channel id (1, 2,...)
    isDisplayed = false;        // false if not already displayed
    pause = false               // true if paused (source,view) - use setPause

    // audioInputDevice/generator/... (@see globals.js)
    sourceId = null;            // source id of the signal, e.g., 'input', 'file', etc.

    source = null;              // signal source (Source_Id_AudioInput, ...)
    streamSource = null;        // media stream source
    stream = null;              // media stream
    analyzer = null;            // audio analyzer
    generator = null            // generator if any
    audioContext = null         // audio context for processing
    getSamplesTask = null       // samples provider if required
    out = false                 // true if channel is binded to audio output
    outMute = false             // if true out is mute due to pause
    outConnected = false

    view = null;                // signal view (drawer)
    measures = null;            // signal measures data
    measuresView = null;        // signal measures view

    color = 'cyan';             // color for channel
    lineWidth = 1;              // line width for channel

    vScale = 1;                 // volt scale (256 digital value corresponding volts)
    yScale = 1;                 // multiplier for Y-axis scaling
    xScale = 1;                 // multiplier for X-axis scaling
    yOffset = 0;                // Y-axis offset for channel
    xOffset = 0;                // X-axis offset for channel

    error = null;               // error message if any

    ui = false;                 // indicates if ui is built for this channel

    triggerOn = false;          // trigger enabled
    triggerKind = null;

    constructor(channelId, sourceId) {
        this.channelId = channelId;
        this.sourceId = sourceId;
        this.measures = new SignalMeasures();
        this.measuresView = new SignalMeasuresView();
        this.view = new SignalView();
        this.measuresView.init(this, this.measures);
    }

    setPause(pause) {
        this.pause = pause
        this.setPauseOut(pause)
    }

    setPauseOut(pause) {
        if (this.out || this.outMute) {
            const isPaused = this.pause || oscilloscope.pause
            if ((isPaused && this.outConnected)
                || (!isPaused && !this.outConnected)) {
                oscilloscope.setOut(this, !pause)
            }
            this.outMute = isPaused
            this.out = !this.outMute
        }
    }

    // unset channel source
    deleteSource() {
        if (this.generator != null)
            this.generator.stop()
        if (this.out || this.outMute)
            oscilloscope.setOut(this, false)

        this.sourceId = Source_Id_None
        this.streamSource =
            this.generator =
            this.analyzer =
            this.getSamplesTask =
            this.audioContext = null
        this.measures.reset()
        this.out =
            this.outConnected =
            this.outMute = false
    }
}
