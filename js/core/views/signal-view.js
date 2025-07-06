// signal view

class SignalView {

    canvas = null;           // canvas for visualization
    pause = false;           // pause flag for visualization
    hidden = false;          // hidden for vizualisation
    channel = null;          // channel

    init(canvas, channel) {
        this.canvas = canvas;
        this.channel = channel;
    }

    run() {

        ui.setupCanvasSize(this.canvas);
        const canvasHeight = this.canvas.height;
        const canvasWidth = this.canvas.width;
        const dataArray = this.channel.measures.dataArray;

        if (dataArray != null) {

            var x = -1;
            var y = -1;
            const drawContext = this.canvas.getContext('2d');

            const signalRange = settings.audioInput.vScale;
            const displayRange = settings.oscilloscope.vPerDiv * 5.0;        // 10/2 ?

            for (var i = 0; i < dataArray.length; i += 1) {
                var value = dataArray[i];
                value = valueToVolt(this.channel, value);
                // adjust y position (y multiplier, y position shift, v scale)                
                var percent = -value / signalRange;
                percent *= signalRange / displayRange; // adjust to display range
                var height = canvasHeight * percent / 2.0;
                height *= this.channel.yScale;
                var offset = canvasHeight / 2 + height;
                offset += this.channel.yOffset;

                var barWidth = canvasWidth / dataArray.length;      // full buffer view

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

}
