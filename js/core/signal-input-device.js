// signal input manager

signalInputDevice = {

    constructor: function () {
        this.init();
    },

    init: function () {
        if (settings.debug.info) {
            console.log('Input initialized');
        }
    },

    getMediaStream: async function () {
        try {
            stream = await navigator
                .mediaDevices
                .getUserMedia({
                    audio: true,
                    video: false
                });
            if (settings.debug.info)
                console.log('Media stream obtained:', stream);
            return stream;
        } catch (err) {
            console.error('Error accessing media devices.', err);
        }
    }
}
