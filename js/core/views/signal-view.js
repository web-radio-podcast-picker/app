// signal view

class SignalView {

    canvas = null;           // canvas for visualization
    pause = false;           // pause flag for visualization
    visible = true;          // visible flag for visualization
    hidden = false;          // hidden for vizualisation
    channel = null;          // channel
    renderers = []          // renderers . on sigview, before signal draw
    pointRenderers = []     // point renderers. on signal point, before signal point

    init(canvas, channel) {
        this.canvas = canvas;
        this.channel = channel;
        this.pointRenderers.push(new TempColorRenderer())
        this.pointRenderers.push(new BrightRenderer())
    }

    offsetToVolt(offset) {
        const canvasHeight = this.canvas.height;
        const signalRange = settings.audioInput.vScale;
        const displayRange = this.getDisplayRange()

        offset -= this.channel.yOffset
        var height = offset - canvasHeight / 2.0
        height /= this.channel.yScale
        var percent = height * 2.0 / canvasHeight
        percent /= signalRange / displayRange
        const value = -percent * signalRange
        return value
    }

    voltOffset(value) {
        const canvasHeight = this.canvas.height;
        const signalRange = settings.audioInput.vScale;
        const displayRange = this.getDisplayRange()

        // adjust y position (y multiplier, y position shift, v scale)
        var percent = -value / signalRange;
        percent *= signalRange / displayRange; // adjust to display range
        var height = canvasHeight * percent / 2.0;
        height *= this.channel.yScale;
        var offset = canvasHeight / 2 + height;
        offset += this.channel.yOffset;
        return offset
    }

    getDisplayRange() {
        return settings.oscilloscope.vPerDiv * 5.0
    }

    run() {
        this.channel.markers.setTriggerControlVisibility(this.visible)

        const sizeUpdated = ui.setupCanvasSize(this.canvas)
        if (sizeUpdated)
            ui.setupUIComponents()

        if (!this.visible) return;

        const canvasHeight = this.canvas.height;
        const canvasWidth = this.canvas.width;
        const dataArray = this.channel.measures.dataArray;

        if (dataArray != null) {

            var x = -1;
            var y = -1;
            const drawContext = this.canvas.getContext('2d');

            const signalRange = settings.audioInput.vScale
            const displayRange = this.getDisplayRange()        // base

            const timePerDiv = settings.oscilloscope.tPerDiv;
            // full buffer view : scale 1ms/div
            const barWidth = canvasWidth / dataArray.length / timePerDiv;

            const baseI = this.channel.trigger.isOn ?
                this.channel.trigger.checkTrigger(this.channel, dataArray) : 0

            const rprops = {
                canvasWidth: canvasWidth
            }

            this.renderers.forEach(r => {
                r(this.channel, drawContext, rprops)
            })

            for (var i = baseI; i < dataArray.length; i += 1) {
                var value = dataArray[i];

                value = valueToVolt(this.channel, value);
                const offset = this.voltOffset(value)

                var nx = (i - baseI) * barWidth
                var ny = offset;
                if (x == -1 && y == -1) {
                    x = nx
                    y = ny
                }

                const m = this.channel.measures
                const absMax = Math.max(Math.abs(m.vMax), Math.abs(m.vMin))
                const absVal = Math.abs(value)
                const absF = 1.0 - ((absMax - absVal) / absMax)

                drawContext.beginPath()
                drawContext.moveTo(x, y)
                drawContext.lineTo(nx, ny)
                drawContext.setLineDash([]);
                var col = this.channel.color
                drawContext.strokeStyle = col
                const props = {
                    col: col,
                    op: 1,
                    value: value,
                    absMax: absMax,
                    absVal: absVal,
                    absF: absF,
                    offset: offset
                }

                this.pointRenderers.forEach(o => {
                    var r = o.render(this.channel, drawContext, props)
                    if (r.col !== undefined)
                        props.col = r.col
                })

                drawContext.lineWidth = this.channel.lineWidth
                drawContext.stroke()

                x = nx
                y = ny
            }
            this.channel.isDisplayed = true;
        }
    }


}
