// channel

class Channel {

    channelId = null;           // channel id (1, 2,...)

    sourceId = null;            // source id of the signal, e.g., 'input', 'file', etc.
    source = null;              // signal source (audioInputDevice, ...)
    streamSource = null;        // media stream source
    stream = null;              // media stream
    analyzer = null;            // audio analyzer

    view = null;                // oscilloscope view
    measures = null;            // signal measures data
    measuresView = null;        // signal measures view

    pause = false;              // pause the channel oscilloscope
    color = 'cyan';             // color for channel 1
    lineWidth = 1;              // line width for channel 1

    yMultiplier = 2;            // multiplier for Y-axis scaling
    yOffset = 0;                // Y-axis offset for channel 1
}
