// renderer for signal view
class TempColorRenderer {

    render(channel, sigView, drawContext, props) {
        if (channel.tempColor) {
            const t = parseRgba(props.col)
            var r = t.r
            var g = t.g
            var b = t.b
            const m = channel.measures
            const absMax = Math.max(Math.abs(m.vMax), Math.abs(m.vMin))
            const absVal = Math.abs(props.value)
            const op = 1.0 - ((absMax - absVal) / absMax)
            const col = 'rgba(' + r + ',' + g + ',' + b + ',' + op + ')'
            drawContext.strokeStyle = col
            props.col = col
            props.op = op
            return props
        }
        return props
    }

}
