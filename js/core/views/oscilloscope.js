// oscilloscope view

oscilloscope = {

    canvas: null,       // canvas for visualization
    analyzer: null,     // audio analyzer
    startTime: null,    // start time for visualization
    endTime: null,      // end time for visualization

    init: function (canvas, analyzer) {
        this.canvas = canvas;
        this.analyzer = analyzer;
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

            var x = -1;
            var y = -1;

            // instant value
            const ival = document.querySelector('#ival');
            ival.textContent = dataArray[0];

            for (var i = 0; i < dataArray.length; i++) {
                var value = dataArray[i];

                // adjust y position (y multiplier, y position shift)
                var relval = (value - 128) * settings.oscilloscope.yMultiplier;// + 128;

                var percent = relval / 128;
                var height = canvasHeight * percent / 2.0;
                var offset = canvasHeight / 2 + height;
                var barWidth = canvasWidth / dataArray.length;

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

            if (!settings.oscilloscope.pause)
                requestAnimationFrame(this.visualize.bind(this));

        } else {
            console.warn("Analyzer not set up yet");
        }
    },
};
