/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// signal fft view

class FFTView {

    canvas = null;           // canvas for visualization
    pause = false;           // pause flag for visualization
    visible = settings.oscilloscope.defaultFFTViewVisible         // visible flag for visualization
    hidden = false;          // hidden for vizualisation
    channel = null;          // channel
    renderers = []           // renderers . on sigview, before signal draw
    pointRenderers = []      // point renderers. on signal point, before signal point
    ///fftAxesRenderer = new FFTAxesRenderer()

    init(canvas, channel) {
        this.canvas = canvas;
        this.channel = channel;
        /*this.renderers.push((channel, dc, props) => {
            this.fftAxesRenderer.render(channel, dc, props)
        })*/
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

    dbOffset2(value) {
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
        offset += canvasHeight / 1.5

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

        ///const sizeUpdated = ui.setupCanvasSize(this.canvas)
        ///if (sizeUpdated)
        ///    ui.setupUIComponents()

        if (!this.visible) return
        if (this.canvas == null) return
        if (this.channel != null && !this.channel.connected) return

        const cnvSize = this.canvas.getBoundingClientRect()
        const canvasHeight = cnvSize.height;
        const canvasWidth = cnvSize.width;

        const dataArray = this.channel?.getSamplesTask?.fftDataArray

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

            const winSize = settings.fft.winSize
            const offsetY = settings.fft.pos.ratioDy * canvasHeight
            const baseY = this.dbOffset(settings.fft.clamp.minDb) + offsetY

            var freqs = []
            var lfreqs = []
            var idxs = []
            var vls = []
            var ys = []

            const spl = this.channel?.getSamplesTask
            const n = dataArray.length

            const nb = settings.fft.bars
            const stp = n / nb
            const fstp = 1 / (nb * 2.0) * spl.sampleRate

            window.snd = {
                freqs: freqs,
                lfreqs: lfreqs,
                stp: stp,
                fstp: fstp,
                idxs: idxs,
                vls: vls,
                ys: ys
            }
            // 0 .. 50hz .. 100hz ... 150hz ... 200hz
            // 0 .. 50 .. 61 .. 
            var band = -1
            const k = 5.0
            const minBand = 50
            const originX = stp * barWidth / settings.fft.pos.ratioDx
            const leftSpc = settings.fft.shape.marginLeft

            for (var i = baseI; i < n; i += stp) {

                //freqs.push(i / (n * 2.0) * spl.sampleRate)
                const linearFrq = band / nb * spl.sampleRate / 2.0
                freqs.push(linearFrq)
                const logFrq = band == -1 ? 0 : Math.exp(band / k) * minBand
                const logFrq2 = band == -1 ? minBand : Math.exp((band + 1) / k) * minBand
                lfreqs.push(logFrq)

                var i0 = (logFrq / (spl.sampleRate / 2.0)) * n
                var i1 = (logFrq2 / (spl.sampleRate / 2.0)) * n
                i0 = Math.round(i0)
                i1 = Math.round(i1)
                const bandSize = i1 - i0 + 1
                idxs.push(i0)

                // magnitude
                var value = 0
                var mdb = Number.MAX_VALUE
                //for (var j = i; j < i + stp; j++) {
                for (var j = i0; j <= i1; j++) {
                    var v = dataArray[j]
                    //mdb = Math.min(mdb, v)
                    value += v
                }
                //if (mdb == 0) mdb = 0.000001

                // average
                value /= bandSize

                // clamp
                if (settings.fft.clamp.enabled) {
                    value = Math.max(value, settings.fft.clamp.minDb)
                    value = Math.min(value, settings.fft.clamp.maxDb)
                    //mdb = Math.max(mdb, settings.fft.clamp.minDb)
                    //mdb = Math.min(mdb, settings.fft.clamp.maxDb)
                }

                // magnitude ?
                //value /= Math.abs(mdb) / 400.0
                //value *= Math.abs(mdb) / 100.0
                vls.push(value)

                //const offset = this.dbOffset(value) - canvasHeight / 2
                const offset = this.dbOffset(value) // - canvasHeight / 2
                    + offsetY
                ys.push(offset)

                var nx = (i - baseI) * barWidth + originX
                var ny = offset
                if (x == -1 && y == -1) {
                    x = nx
                    y = ny
                }
                x += leftSpc
                nx = (i - baseI + stp) * barWidth + originX
                var rHeight = ny - baseY
                if (rHeight == 0) rHeight = -2

                const m = this.channel.measures

                dc.beginPath()
                dc.moveTo(x, ny)
                //dc.lineTo(nx, ny)
                var col = this.channel.fft.color
                dc.strokeStyle = settings.fft.shape.strokeColor
                dc.fillStyle = this.channel.color
                dc.fillRect(x, baseY, nx - x, rHeight)
                dc.rect(x, baseY, nx - x, rHeight)

                dc.setLineDash([])
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
                band++
            }
            this.channel.fft.isDisplayed = true;
        }
    }


}
