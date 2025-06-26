// app settings
window.settings = {

    debug: {
        trace: true
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

    },

    ui: {
        clientWidthBorder: 0, // default border width for client area
        clientHeightBorder: 0 // default border height for client area
    }
};

navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

console.log('Settings initialized:', settings);