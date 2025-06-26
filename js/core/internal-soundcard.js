// soundcard signal input manager

internalSoundcard = {

    constructor: function () {
        this.init();
    },

    init: function () {
        if (settings.debug.trace) {
            console.log('Internal soundcard initialized');
        }
    },

    getMediaStream: async function () {
        try {
            stream = await navigator
                .mediaDevices
                .getUserMedia({
                    audio: settings.audioInput,
                    video: false
                });
            console.log('Media stream obtained:', stream);
            return stream;
        } catch (err) {
            console.error('Error accessing media devices.', err);
        }
    }
}
