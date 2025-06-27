// signal view

class SignalView {

    canvas = null;           // canvas for visualization
    lastStartTime = null;    // last start time for visualization
    startTime = null;        // start time for visualization
    endTime = null;          // end time for visualization
    pause = false;           // pause flag for visualization
    dataArray = null;        // data array for signal data
    properties = null;       // properties for signal view

    init(canvas, properties) {
        this.canvas = canvas;
        this.properties = properties;
    }

    run() {

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

        const bufferLength = getSamplesTask.bufferLength;
        if (this.dataArray == null || !this.pause) {
            // refresh draw buffer
            this.dataArray = [...getSamplesTask.dataArray];
        }

        const drawContext = this.canvas.getContext('2d');

        var x = -1;
        var y = -1;

        if (!this.pause)
            this.properties.measures.setValue(this.dataArray[0]);

        for (var i = 0; i < this.dataArray.length; i += 1) {
            var value = this.dataArray[i];

            // adjust y position (y multiplier, y position shift)
            var relval = (value - 128) * this.properties.yMultiplier;

            var percent = relval / 128;
            var height = canvasHeight * percent / 2.0;
            var offset = canvasHeight / 2 + height;
            offset += this.properties.yOffset;
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
            drawContext.strokeStyle = this.properties.color;
            drawContext.lineWidth = this.properties.lineWidth;
            drawContext.stroke();

            x = nx;
            y = ny;
        }

        this.endTime = Date.now();
    }
}
