// app settings
window.settings = {

    debug: {
        trace: true,
        info: true
    },

    audioInput: {
        deviceId: 'default',    // default device ID for audio input/output
        channelCount: 2,        // stereo by default
        sampleRate: 44100,      // default sample rate
        bufferSize: 1024,       // default buffer size
        latency: 0.1,           // default latency in seconds
        audioEnabled: true
    },

    oscilloscope: {
        channel1: {
            pause: false,           // pause the oscilloscope
            yMultiplier: 2,         // multiplier for Y-axis scaling
            measures: null,         // measures for signal data,
            color: 'cyan',          // color for channel 1
            lineWidth: 1,           // line width for channel 1
            yOffset: 0,             // Y-axis offset for channel 1
            source: 'input'         // source of the signal, e.g., 'input', 'file', etc.
        },
        channel2: {
            pause: false,           // pause the oscilloscope
            yMultiplier: 2,         // multiplier for Y-axis scaling
            measures: null,         // measures for signal data
            color: 'yellow',        // color for channel 2
            lineWidth: 1,           // line width for channel 2
            yOffset: 200,           // Y-axis offset for channel 1
            source: 'oscillator'    // source of the signal, e.g., 'input', 'file', etc.
        }
    },

    ui: {
        clientWidthBorder: 0,   // default border width for client area
        clientHeightBorder: 4   // default border height for client area
    }
};

navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

if (settings.debug.info)
    console.log('Settings initialized:', settings);
