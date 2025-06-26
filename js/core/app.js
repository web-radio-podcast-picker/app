// this is the main app body

sigapp = {

    // properties

    inputDevice: null,  // input device for audio
    input: null,        // input media stream source
    analyzer: null,     // audio analyzer
    stream: null,       // media stream
    audioContext: null, // audio context
    canvas: null,       // canvas for visualization

    // operations

    run: async function () {

        this.canvas = document.querySelector('canvas');
        this.inputDevice = signalInputDevice;
        this.stream = await this.inputDevice.getMediaStream();

        if (this.stream != undefined) {
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
        console.log("Analyzer created", this.analyzer);
        this.input.connect(this.analyzer);
        console.log("Input stream set");
        // Setup a timer to visualize some stuff.
        requestAnimationFrame(this.visualize.bind(this));
    },

    visualize: function () {
        if (this.analyzer != null) {

            const html = document.querySelector('html');
            const htmlWidth = html.clientWidth;
            const htmlHeight = html.clientHeight;
            if (this.canvas.width !== htmlWidth - settings.ui.clientWidthBorder)
                this.canvas.width = htmlWidth - settings.ui.clientWidthBorder;
            if (this.canvas.height !== htmlHeight - settings.ui.clientHeightBorder)
                this.canvas.height = htmlHeight - settings.ui.clientHeightBorder;

            const canvasHeight = this.canvas.height;
            const canvasWidth = this.canvas.width;
            const bufferLength = this.analyzer.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            this.analyzer.getByteTimeDomainData(dataArray);

            const drawContext = this.canvas.getContext('2d');
            drawContext.clearRect(0, 0, canvasWidth, canvasHeight);

            var x = 0;
            var y = 0;

            for (var i = 0; i < dataArray.length; i++) {
                var value = dataArray[i];
                var percent = value / 256;
                var height = canvasHeight * percent;
                var offset = canvasHeight - height - 1;
                var barWidth = canvasWidth / dataArray.length;

                drawContext.fillStyle = 'white';
                //drawContext.fillRect(i * barWidth, offset, 1, 1);

                var nx = i * barWidth;
                var ny = offset;
                drawContext.beginPath();
                drawContext.moveTo(x, y);
                drawContext.lineTo(nx, ny);
                drawContext.strokeStyle = 'white';
                drawContext.lineWidth = 1;
                drawContext.stroke();

                x = nx;
                y = ny;
            }
            requestAnimationFrame(this.visualize.bind(this));
        } else {
            console.warn("Analyzer not set up yet");
        }
    },
};

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');
    sigapp.run();
}, false);
