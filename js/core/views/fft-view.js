/*
    Sound card Oscilloscope Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// signal fft view

class FFTView {

    canvas = null;           // canvas for visualization
    pause = false;           // pause flag for visualization
    visible = false;          // visible flag for visualization
    hidden = false;          // hidden for vizualisation
    channel = null;          // channel
    renderers = []          // renderers . on sigview, before signal draw
    pointRenderers = []     // point renderers. on signal point, before signal point

    init(canvas, channel) {
        this.canvas = canvas;
        this.channel = channel;
        //this.pointRenderers.push(new TempColorRenderer())
        //this.pointRenderers.push(new BrightRenderer())
    }

    /*
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
    */

    dbOffset(value) {
        const canvasHeight = this.canvas.height;
        const displayRange = this.getDisplayRange()

        // min  .. max
        // -100 .. -30  ref (analyzer.minDecibels,analyzer.maxDecibels)
        //     -65      -> 50% = -65 --100      +35
        //                      / abs(max-min)  +70 == 0.5                        

        const minDb = -100
        const maxDb = -30
        var dbRange = Math.abs(maxDb - minDb)
        var reldb = (value - minDb) / dbRange

        //var percent = -value / signalRange;
        var percent = reldb * displayRange

        //percent *= signalRange / displayRange; // adjust to display range

        // vertical scale factor (or logarythmic scale?)
        const vScale = 20

        // height relative to view height        
        var height = canvasHeight * percent;
        // height relative to the half bottom part of the view
        var offset = canvasHeight / 2 - height / vScale;
        offset += canvasHeight / 4

        return offset
    }

    getDisplayRange() {
        // fft vscale currently fixed to view height
        return 0.5 * 5.0
    }

    run() {

        const sizeUpdated = ui.setupCanvasSize(this.canvas)
        if (sizeUpdated)
            ui.setupUIComponents()

        if (!this.visible) return;

        const canvasHeight = this.canvas.height;
        const canvasWidth = this.canvas.width;
        const dataArray = this.channel.measures.fftDataArray;

        if (dataArray != null) {

            var x = -1
            var y = -1
            const drawContext = this.canvas.getContext('2d')

            // full buffer view : scale 1ms/div
            const barWidth = canvasWidth / dataArray.length / this.channel.fft.hScale

            const baseI = 0

            const rprops = {
                canvasWidth: canvasWidth
            }

            this.renderers.forEach(r => {
                r(this.channel, drawContext, rprops)
            })

            for (var i = baseI; i < dataArray.length; i += 1) {
                var value = dataArray[i];

                const offset = this.dbOffset(value)

                var nx = (i - baseI) * barWidth
                var ny = offset;
                if (x == -1 && y == -1) {
                    x = nx
                    y = ny
                }

                const m = this.channel.measures

                drawContext.beginPath()
                drawContext.moveTo(x, y)
                drawContext.lineTo(nx, ny)
                drawContext.setLineDash([]);
                var col = this.channel.fft.color
                drawContext.strokeStyle = col
                const props = {
                    col: col,
                    op: 1,
                    value: value,
                    offset: offset
                }

                this.pointRenderers.forEach(o => {
                    var r = o.render(this.channel, drawContext, props)
                    if (r.col !== undefined)
                        props.col = r.col
                })

                drawContext.lineWidth = this.channel.fft.lineWidth
                drawContext.stroke()

                x = nx
                y = ny
            }
            this.channel.isDisplayed = true;
        }
    }


}
