// app settings
window.settings = {
    debug: {
        trace: true
    },
    audioInput: {
        deviceId: 'default',    // default device ID for audio input/output
        channelCount: 2,        // stereo by default
        sampleRate: 44100,      // default sample rate
        bufferSize: 512,        // default buffer size
        latency: 0.1,           // default latency in seconds
        audioEnabled: true
    },

    // UI settings
    //theme: 'light', // 'light' or 'dark'*/
};

console.log('Settings initialized:', settings);