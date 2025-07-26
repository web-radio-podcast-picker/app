// renderer for signal view
class TempColorRenderer {

    render(channel, drawContext, props) {
        if (channel.tempColor) {
            const t = parseRgba(props.col)
            var r = t.r
            var g = t.g
            var b = t.b
            const col = toRgba(r, g, b, props.absF)
            drawContext.strokeStyle = col
            props.col = col
            props.op = props.absF
            return props
        }
        return props
    }

}
