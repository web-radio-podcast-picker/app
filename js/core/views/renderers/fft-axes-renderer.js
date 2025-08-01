/*
    Sound card Oscilloscope | Signal Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// renderer for bright renderer
class FFTAxesRenderer {

    render(channel, drawContext, props) {
        if (channel.fftView.visible) {
            const t = parseRgba(channel.fft.grid.color)
            var r = t.r
            var g = t.g
            var b = t.b
            const col = toRgba(r, g, b, channel.fft.grid.opacity)

            const x0 = 0
            const x1 = props.canvasWidth - 1
            const y = props.canvasHeight - 1 + settings.ui.fftAxeRelY

            drawContext.beginPath()
            drawContext.strokeStyle = col
            drawContext.setLineDash(channel.fft.grid.dash)
            drawContext.lineWidth = channel.fft.grid.lineWidth
            drawContext.moveTo(x0, y)
            drawContext.lineTo(x1, y)
            drawContext.stroke()

            return props
        }
        return props
    }
}
