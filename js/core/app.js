// this is the main app body

app = {

    // properties

    inputDevice: null,          // input device for audio
    input: null,                // input media stream source
    analyzer: null,             // audio analyzer
    stream: null,               // media stream
    audioContext: null,         // audio context
    // channel 1
    signalView: null,           // oscilloscope view
    signalMeasuresView: null,   // signal measures view
    signalMeasures: null,       // signal measures data
    // channel 2
    signalView2: null,          // oscilloscope view for channel 2
    signalMeasuresView2: null,  // signal measures view for channel 2   
    signalMeasures2: null,      // signal measures data for channel 2
    tasks: [],                  // tasks,
    canvas: null,               // canvas for visualization

    // operations

    run: async function () {

        this.signalMeasures = signalMeasures;
        this.signalMeasuresView = signalMeasuresView;
        this.signalView = signalView;
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

        // setup tasks & views
        this.signalView.init(
            this.canvas,
            this.analyzer,
            this.signalMeasures);

        this.tasks.push(this.signalView);
        this.tasks.push(this.signalMeasuresView);

        // Setup a timer to visualize some stuff.
        this.requestAnimationFrame();
    },

    requestAnimationFrame: function () {
        this.tasks.forEach(view => {
            requestAnimationFrame(view.visualize.bind(view));
        });
    }

};

document.addEventListener('DOMContentLoaded', function () {
    if (settings.debug.trace)
        console.log('DOM fully loaded and parsed');
    app.run();
}, false);
