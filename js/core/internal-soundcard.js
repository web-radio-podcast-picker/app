// soundcard signal input manager

internalSoundcard = {

    constructor: function () {
        this.init();
    },

    init: function () {
        if (settings.trace) {
            console.log('internal soundcard initialized');
        }
    },

    getMediaStream: async function () {
        try {
            stream = await navigator
                .mediaDevices
                .getUserMedia({
                    audio: {
                        deviceId: settings.inputDeviceId || 'default',
                        sampleRate: settings.sampleRate || 44100,
                        channelCount: settings.channelCount || 2,
                        latency: settings.latency || 0.1
                    },
                    video: false
                });
            console.log('Media stream obtained:', stream);
            return stream;
        } catch (err) {
            console.error('Error accessing media devices.', err);
        }
    }
}
