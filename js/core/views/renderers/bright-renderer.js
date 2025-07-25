// renderer for bright renderer
class BrightRenderer {

    render(channel, sigView, drawContext, props) {
        if (channel.bright) {
            const t = parseRgba(props.col)
            var r = t.r
            var g = t.g
            var b = t.b
            if (props.op !== undefined) {
                const pop = props.op
                r *= pop
                g *= pop
                b *= pop
            }

            const m = channel.measures
            const absMax = Math.max(Math.abs(m.vMax), Math.abs(m.vMin))
            const absVal = Math.abs(props.value)
            const d = 1
            const op = 1.0 - ((d * absMax - absVal) / d * absMax)

            const addLight = (c, fop) => {
                c += fop
                if (c < 0) c = 0
                if (c > 255) c = 255
                return c
            }

            const fop = op / 4 * 255 + 50
            r = addLight(r, fop)
            g = addLight(g, fop)
            b = addLight(b, fop)

            const col = 'rgba(' + r + ',' + g + ',' + b + ',' + 1 + ')'
            drawContext.strokeStyle = col
            props.col = col
            props.op = op
            return props
        }
        return props
    }
}
