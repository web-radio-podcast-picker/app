// signal view

class SignalView {

    canvas = null;           // canvas for visualization
    pause = false;           // pause flag for visualization
    dataArray = null;        // data array for signal data
    channel = null;          // channel

    init(canvas, channel) {
        this.canvas = canvas;
        this.channel = channel;
    }

    run() {

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
            this.channel.measures.setValue(this.channel, this.dataArray[0]);

        for (var i = 0; i < this.dataArray.length; i += 1) {
            var value = this.dataArray[i];

            // adjust y position (y multiplier, y position shift)
            var relval = (value - 128) * this.channel.yMultiplier;

            var percent = relval / 128;
            var height = canvasHeight * percent / 2.0;
            var offset = canvasHeight / 2 + height;
            offset += this.channel.yOffset;
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
            drawContext.strokeStyle = this.channel.color;
            drawContext.lineWidth = this.channel.lineWidth;
            drawContext.stroke();

            x = nx;
            y = ny;
        }
    }
}
