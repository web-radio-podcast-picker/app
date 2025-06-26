// signal view

signalView = {

    canvas: null,           // canvas for visualization
    analyzer: null,         // audio analyzer
    lastStartTime: null,    // last start time for visualization
    startTime: null,        // start time for visualization
    endTime: null,          // end time for visualization
    pause: false,           // pause flag for visualization
    dataArray: null,        // data array for signal data
    measures: null,         // measures of signal data

    init: function (canvas, analyzer, measures) {
        this.canvas = canvas;
        this.analyzer = analyzer;
        this.measures = measures;
    },

    visualize: function () {
        if (this.analyzer != null) {

            this.lastStartTime = this.startTime;
            this.startTime = Date.now();
            const html = document.querySelector('html');
            const htmlWidth = html.clientWidth;
            const htmlHeight = html.clientHeight;

            // auto size canvas (maximize)
            if (this.canvas.width !== htmlWidth - settings.ui.clientWidthBorder)
                this.canvas.width = htmlWidth - settings.ui.clientWidthBorder;
            if (this.canvas.height !== htmlHeight - settings.ui.clientHeightBorder)
                this.canvas.height = htmlHeight - settings.ui.clientHeightBorder;

            const canvasHeight = this.canvas.height;
            const canvasWidth = this.canvas.width;

            const bufferLength = this.analyzer.frequencyBinCount;
            if (this.dataArray == null || !this.pause) {
                // refresh draw buffer
                this.dataArray = new Uint8Array(bufferLength);
                this.analyzer.getByteTimeDomainData(this.dataArray);
            }

            const drawContext = this.canvas.getContext('2d');
            // clear view
            drawContext.clearRect(0, 0, canvasWidth, canvasHeight);

            var x = -1;
            var y = -1;

            if (!this.pause)
                signalMeasures.setValue(this.dataArray[0]);

            for (var i = 0; i < this.dataArray.length; i++) {
                var value = this.dataArray[i];

                // adjust y position (y multiplier, y position shift)
                var relval = (value - 128) * settings.oscilloscope.yMultiplier;

                var percent = relval / 128;
                var height = canvasHeight * percent / 2.0;
                var offset = canvasHeight / 2 + height;
                var barWidth = canvasWidth / this.dataArray.length;

                var nx = i * barWidth;
                var ny = offset;
                if (x == -1 && y == -1) {
                    x = nx;
                    y = ny;
                }
                drawContext.beginPath();
                drawContext.moveTo(x, y);
                drawContext.lineTo(nx, ny);
                drawContext.strokeStyle = 'white';
                drawContext.lineWidth = 1;
                drawContext.stroke();

                x = nx;
                y = ny;
            }

            this.endTime = Date.now();
            app.requestAnimationFrame();

        } else {
            console.warn("Analyzer not set up yet");
        }
    },
};
