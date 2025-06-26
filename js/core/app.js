// this is the main app body

app = {

    // properties

    inputDevice: null,  // input device for audio
    input: null,        // input media stream source
    analyzer: null,     // audio analyzer
    stream: null,       // media stream
    audioContext: null, // audio context
    oscilloscope: null, // oscilloscope view

    // operations

    run: async function () {

        this.canvas = document.querySelector('canvas');
        this.oscilloscope = oscilloscope;
        this.inputDevice = signalInputDevice;
        this.stream = await this.inputDevice.getMediaStream();

        if (this.stream != undefined) {
            if (settings.debug.info)
                console.log("Input media stream ok");
            this.setInput(this.stream);
        }
        else {
            console.error("No input media stream");
        }
    },

    setInput(stream) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.input = this.audioContext.createMediaStreamSource(stream);
        this.analyzer = this.audioContext.createAnalyser();
        this.input.connect(this.analyzer);
        if (settings.debug.info)
            console.log("Input stream set");

        // launch oscilloscope
        // Setup a timer to visualize some stuff.
        oscilloscope.init(this.canvas, this.analyzer);
        requestAnimationFrame(oscilloscope.visualize.bind(oscilloscope));
    }

};

document.addEventListener('DOMContentLoaded', function () {
    if (settings.debug.trace)
        console.log('DOM fully loaded and parsed');
    app.run();
}, false);
