// channel

class Channel {

    channelId = null;           // channel id (1, 2,...)

    sourceId = null;            // source id ('input',...)
    source = null;              // signal source (signalInputDevice, ...)
    streamSource = null;        // media stream source
    stream = null;              // media stream
    analyzer = null;            // audio analyzer

    signalView = null;          // oscilloscope view
    signalMeasures = null;      // signal measures data
    signalMeasuresView = null;  // signal measures view

    minV = -2.5;                // minimum volt for signal
    maxV = 2.5;                 // maximum volt for signal
}
