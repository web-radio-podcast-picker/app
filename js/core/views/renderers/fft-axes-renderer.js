/*
    Sound card Oscilloscope | Signal Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// renderer for fft axes

class FFTAxesRenderer {

    render(channel, drawContext, props) {
        if (channel.fftView.visible) {
            const t = parseRgba(channel.fft.grid.color)
            var r = t.r
            var g = t.g
            var b = t.b
            const colr = toRgba(r, g, b, channel.fft.grid.opacity)

            const x0 = 0
            const x1 = props.canvasWidth - 1
            const y = props.canvasHeight - 1 + settings.ui.fftAxeRelY

            drawContext.beginPath()
            drawContext.strokeStyle = colr
            drawContext.setLineDash(channel.fft.grid.dash)
            drawContext.lineWidth = channel.fft.grid.lineWidth
            drawContext.moveTo(x0, y)
            drawContext.lineTo(x1, y)
            drawContext.stroke()

            const colSize = props.canvasWidth / channel.fft.grid.hDivCount
            const frqRange = channel.analyzer.context.sampleRate / 2.0
            const colDFrq = frqRange / channel.fft.grid.hDivCount

            var x = 0

            for (var col = 0; col < channel.fft.grid.hDivCount; col++) {
                const frq = col * colDFrq
                this.drawUnit(channel, drawContext, x, y, frq)
                x += colSize
            }

            const rowSize = props.canvasHeight / channel.fft.grid.vDivCount

            // for (var row = 0; row < channel.fft.grid.vDivCount; row++) {

            return props
        }
        return props
    }

    drawUnit(channel, dc, x, y, t) {
        dc.font = settings.oscilloscope.grid.units.font;
        dc.fillStyle = channel.fft.grid.color;
        const xrel = channel.fft.grid.markers.xRel;
        const yrel = channel.fft.grid.markers.yRel;
        dc.fillText(t, x + xrel, y + yrel);
    }
}
