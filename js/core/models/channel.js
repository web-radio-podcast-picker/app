// channel

class Channel {

    channelId = null;           // channel id (1, 2,...)

    // audioInputDevice
    // generator
    // file
    // channel (CH1, CH2, ...)
    sourceId = null;            // source id of the signal, e.g., 'input', 'file', etc.

    source = null;              // signal source (audioInputDevice, ...)
    streamSource = null;        // media stream source
    stream = null;              // media stream
    analyzer = null;            // audio analyzer

    view = null;                // oscilloscope view
    measures = null;            // signal measures data
    measuresView = null;        // signal measures view

    color = 'cyan';             // color for channel 1
    lineWidth = 1;              // line width for channel 1

    vScale = 1;                 // volt scale (256 digital value corresponding volts)
    yScale = 1;                 // multiplier for Y-axis scaling
    xScale = 1;                 // multiplier for X-axis scaling
    yOffset = 0;                // Y-axis offset for channel 1
    xOffset = 0;                // X-axis offset for channel 1

    error = null;               // error message if any

    ui = false;                 // indicates if ui is built for this channel

    constructor(channelId, sourceId) {
        this.channelId = channelId;
        this.sourceId = sourceId;
        this.measures = new SignalMeasures();
        this.measuresView = new SignalMeasuresView();
        this.view = new SignalView();
        this.measuresView.init(this, this.measures);
    }
}
