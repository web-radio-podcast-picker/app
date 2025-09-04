/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// signal fft view

class FFTView {

    canvas = null;           // canvas for visualization
    pause = false;           // pause flag for visualization
    visible = false;         // visible flag for visualization
    hidden = false;          // hidden for vizualisation
    channel = null;          // channel
    renderers = []           // renderers . on sigview, before signal draw
    pointRenderers = []      // point renderers. on signal point, before signal point
    fftAxesRenderer = new FFTAxesRenderer()

    init(canvas, channel) {
        this.canvas = canvas;
        this.channel = channel;
        this.renderers.push((channel, dc, props) => {
            this.fftAxesRenderer.render(channel, dc, props)
        })
    }

    getVScale() {
        return this.channel.fft.vScale * this.channel.fft.vScaleFactor
    }

    dbOffset(value) {
        const canvasHeight = this.canvas.height
        const displayRange = this.getDisplayRange()

        // min  .. max
        // -100 .. -30  ref (analyzer.minDecibels,analyzer.maxDecibels)
        //     -65      -> 50% = -65 --100      +35
        //                      / abs(max-min)  +70 == 0.5                        

        const minDb = this.channel.fft.minDb
        const maxDb = this.channel.fft.maxDb
        var dbRange = Math.abs(maxDb - minDb)
        var reldb = (value - minDb) / dbRange
        var percent = reldb * displayRange

        // vertical scale factor (or logarythmic scale?)
        const vScale = this.getVScale()

        // height relative to view height        
        var height = canvasHeight * percent
        // height relative to the half bottom part of the view
        var offset = canvasHeight / 2 - height / vScale
        // 0: canvasHeight / 2 + (mindb / vscale) + canvasHeight / 4
        // minDb (-100): canvasHeight /2 + canvasHeight / 4
        // maxDb (-30) : canvasHeight /2 - canvasHeight + canvasHeight / 4
        offset += canvasHeight / 4

        return offset
    }

    offsetToDb(offset) {
        const canvasHeight = this.canvas.height
        const displayRange = this.getDisplayRange()
        const vScale = this.getVScale()
        const minDb = this.channel.fft.minDb
        const maxDb = this.channel.fft.maxDb
        var dbRange = Math.abs(maxDb - minDb)

        offset -= canvasHeight / 4
        const height = -(offset - canvasHeight / 2) * vScale
        const percent = height / canvasHeight
        const reldb = percent / displayRange
        const value = reldb * dbRange + minDb
        return value
    }

    getDisplayRange() {
        // fft vscale currently fixed to view height
        return 0.5 * 5.0
    }

    run() {

        const sizeUpdated = ui.setupCanvasSize(this.canvas)
        if (sizeUpdated)
            ui.setupUIComponents()

        if (!this.visible) return

        const canvasHeight = this.canvas.height
        const canvasWidth = this.canvas.width
        const dataArray = this.channel.measures.fftDataArray

        if (dataArray != null) {

            var x = -1
            var y = -1
            const dc = this.canvas.getContext('2d')

            // full buffer view : scale 1ms/div
            const barWidth = canvasWidth / dataArray.length / this.channel.fft.hScale

            const baseI = 0

            const rprops = {
                canvasWidth: canvasWidth,
                canvasHeight: canvasHeight,
                dbOffsetZero: this.dbOffset(0),
                width: canvasWidth,
                height: canvasHeight / 2.0
            }

            this.renderers.forEach(r => {
                r(this.channel, dc, rprops)
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

                dc.beginPath()
                dc.moveTo(x, y)
                dc.lineTo(nx, ny)
                dc.setLineDash([])
                var col = this.channel.fft.color
                dc.strokeStyle = col
                dc.lineWidth = this.channel.fft.lineWidth
                const props = {
                    col: col,
                    op: 1,
                    value: value,
                    offset: offset
                }

                this.pointRenderers.forEach(o => {
                    var r = o.render(this.channel, dc, props)
                    if (r.col !== undefined)
                        props.col = r.col
                })

                dc.lineWidth = this.channel.fft.lineWidth
                dc.stroke()

                x = nx
                y = ny
            }
            this.channel.fft.isDisplayed = true;
        }
    }


}
