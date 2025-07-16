// channel

class Channel {

    channelId = null;           // channel id (1, 2,...)
    isDisplayed = false;        // false if not already displayed

    // audioInputDevice
    // generator
    // file
    // channel (CH1, CH2, ...)
    sourceId = null;            // source id of the signal, e.g., 'input', 'file', etc.

    source = null;              // signal source (Source_Id_AudioInput, ...)
    streamSource = null;        // media stream source
    stream = null;              // media stream
    analyzer = null;            // audio analyzer

    view = null;                // oscilloscope view
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

    // unset channel source
    deleteSource() {
        this.sourceId = Source_Id_None
        this.streamSource = null
        this.analyzer = null
    }
}
