// this is the main app body

app = {

    // properties

    inputDevice: null,          // input device for audio
    input: null,                // input media stream source
    analyzer: null,             // audio analyzer
    stream: null,               // media stream
    audioContext: null,         // audio context
    // channel 1
    signalView1: null,          // oscilloscope view
    signalMeasuresView1: null,  // signal measures view
    signalMeasures1: null,      // signal measures data
    // channel 2
    signalView2: null,          // oscilloscope view for channel 2
    signalMeasuresView2: null,  // signal measures view for channel 2   
    signalMeasures2: null,      // signal measures data for channel 2

    tasks: [],                  // tasks,
    canvas: null,               // canvas for visualization
    ui: null,                   // UI component

    // operations

    run: async function () {

        this.signalMeasures1 = new SignalMeasures();
        this.signalMeasures2 = new SignalMeasures();
        this.signalMeasuresView1 = new SignalMeasuresView();
        this.signalMeasuresView2 = new SignalMeasuresView();
        this.signalView1 = new SignalView();
        this.signalView2 = new SignalView();
        this.signalMeasuresView1.init(1, this.signalMeasures1);
        this.signalMeasuresView2.init(2, this.signalMeasures2);
        settings.oscilloscope.channel1.measures = this.signalMeasures1;
        settings.oscilloscope.channel2.measures = this.signalMeasures2;

        ui.init();

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

        getSamplesTask.init(this.analyzer);

        startViewTask.init(this.canvas);

        this.signalView1.init(
            this.canvas,
            settings.oscilloscope.channel1);

        this.signalView2.init(
            this.canvas,
            settings.oscilloscope.channel2);

        this.tasks.push(getSamplesTask);
        this.tasks.push(startViewTask);
        this.tasks.push(this.signalView1);
        this.tasks.push(this.signalMeasuresView1);
        this.tasks.push(this.signalView2);
        this.tasks.push(this.signalMeasuresView2);
        this.tasks.push(requestAnimationFrameTask);

        // Setup a timer to visualize some stuff.
        this.requestAnimationFrame();
    },

    requestAnimationFrame: function () {
        this.tasks.forEach(view => {
            requestAnimationFrame((() => view.run()).bind(view));
        });
    }

};

document.addEventListener('DOMContentLoaded', function () {
    if (settings.debug.trace)
        console.log('DOM fully loaded and parsed');
    app.run();
}, false);
