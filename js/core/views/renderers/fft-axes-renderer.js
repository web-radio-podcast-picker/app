/*
    Sound card Oscilloscope | Signal Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// renderer for fft axes

class FFTAxesRenderer {

    render(channel, drawContext, props) {

        if (!channel.fftView.visible || !channel.fft.displayGrid) return props
        if (channel.analyzer.context == null) return

        var gridColor = settings.fft.grid.commonColor
        const t = parseRgba(gridColor)
        var r = t.r
        var g = t.g
        var b = t.b
        const colr = toRgba(r, g, b, channel.fft.grid.opacity)

        const x0 = 0
        const x1 = props.width - 1
        var y = props.canvasHeight - 1 + settings.ui.fftAxeRelY

        this.drawAxe(channel, drawContext, x0, y, x1, y, colr)

        const sd = ui.isSmallDisplay()
        const hDivCount = sd ? channel.fft.grid.hDivCountSD
            : channel.fft.grid.hDivCount
        const colSize = props.width / hDivCount
        const frqRange = channel.analyzer.context.sampleRate / 2.0
        const colDFrq = frqRange / hDivCount

        var x = 0
        for (var col = 0; col < hDivCount; col++) {
            const frq = col * colDFrq
            const f = frequency(frq)
            const t = f.value + f.unit.toLowerCase()
            this.drawUnit(channel, drawContext, x, y, gridColor, t)
            this.drawVBar(channel, drawContext, x, y, colr)
            x += colSize
        }

        var yDb0 = channel.fftView.dbOffset(0)
        const rowDDb = sd ? channel.fft.grid.dbPerDivSD
            : channel.fft.grid.dbPerDiv

        x = channel.fft.grid.left
        y = yDb0
        const y1 = y + props.height - 1

        this.drawAxe(channel, drawContext, x, y, x, y1, colr)

        var u = 0
        while (y < props.canvasHeight) {
            y = channel.fftView.dbOffset(u)
            u = vround2(u)
            const unit = u + 'db'
            this.drawHBar(channel, drawContext, x, y, colr)
            this.drawUnit(channel, drawContext, x, y, gridColor, unit)
            u -= rowDDb
        }

        return props
    }

    drawAxe(channel, dc, x0, y0, x1, y1, color) {
        dc.beginPath()
        dc.strokeStyle = color
        dc.setLineDash(channel.fft.grid.dash)
        dc.lineWidth = channel.fft.grid.lineWidth
        dc.moveTo(x0, y0)
        dc.lineTo(x1, y1)
        dc.stroke()
    }

    drawVBar(channel, dc, x, y, color) {
        dc.beginPath()
        dc.strokeStyle = color
        dc.setLineDash(channel.fft.grid.markers.dash)
        dc.lineWidth = channel.fft.grid.lineWidth
        const bh = channel.fft.grid.markers.length / 2.0
        dc.moveTo(x, y - bh)
        dc.lineTo(x, y + bh)
        dc.stroke()
    }

    drawHBar(channel, dc, x, y, color) {
        dc.beginPath()
        dc.strokeStyle = color
        dc.setLineDash(channel.fft.grid.markers.dash)
        dc.lineWidth = channel.fft.grid.lineWidth
        const bh = channel.fft.grid.markers.length / 2.0
        dc.moveTo(x - bh, y)
        dc.lineTo(x + bh, y)
        dc.stroke()
    }

    drawUnit(channel, dc, x, y, color, t) {
        dc.font = settings.oscilloscope.grid.units.font;
        dc.fillStyle = color;
        const xrel = channel.fft.grid.markers.xRel;
        const yrel = channel.fft.grid.markers.yRel;
        dc.fillText(t, x + xrel, y + yrel);
    }
}
