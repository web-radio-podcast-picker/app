// renderer for signal view
class TempColorRenderer {

    render(value, offset, channel, sigView, drawContext) {
        if (channel.tempColor) {
            var col = channel.color
                .replace('rgba(', '')
                .replace(')', '')
                .replace(' ', '')
                .split(',')
            var r = Number(col[0])
            var g = Number(col[1])
            var b = Number(col[2])
            const m = channel.measures
            const absMax = Math.max(Math.abs(m.vMax), Math.abs(m.vMin))
            const absVal = Math.abs(value)
            const op = 1.0 - ((absMax - absVal) / absMax)
            drawContext.strokeStyle =
                'rgba(' + r + ',' + g + ',' + b + ',' + op + ')'
        }
    }

}
