// this is the main app body

app = {

    // properties

    inputDevice: null,          // input device for audio
    input: null,                // input media stream source
    analyzer: null,             // audio analyzer
    stream: null,               // media stream
    audioContext: null,         // audio context
    oscilloscopeView: null,     // oscilloscope view
    signalMeasuresView: null,   // signal measures view
    signalMeasures: null,       // signal measures
    views: [],                  // views,
    signalMeasures: null,       // signal measures data
    canvas: null,               // canvas for visualization

    // operations

    run: async function () {

        this.signalMeasures = signalMeasures;
        this.signalMeasuresView = signalMeasuresView;
        this.oscilloscopeView = oscilloscopeView;
        this.inputDevice = signalInputDevice;
        this.stream = await this.inputDevice.getMediaStream();
        this.canvas = document.querySelector('canvas');

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

        // run views
        // Setup a timer to visualize some stuff.
        this.oscilloscopeView.init(this.canvas, this.analyzer);
        this.views.push(this.oscilloscopeView);
        this.views.push(this.signalMeasuresView);

        this.requestAnimationFrame();
    },

    requestAnimationFrame: function () {
        this.views.forEach(view => {
            requestAnimationFrame(view.visualize.bind(view));
        });
    }

};

document.addEventListener('DOMContentLoaded', function () {
    if (settings.debug.trace)
        console.log('DOM fully loaded and parsed');
    app.run();
}, false);
