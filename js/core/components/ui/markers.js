/*
    Sound card Oscilloscope | Signal Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// channel markers

class Markers {

    $trigger = null
    vAvg = false
    vMin = false
    vMax = false
    trigger = false

    init(channel) {
        this.channel = channel
        const renderers = channel.view.renderers
        renderers.push((channel, dc, props) => {
            this.triggerView(channel, dc, props)
            this.axesView(channel, dc, props)
        })
        return this
    }

    isDraggingTrigger() {
        if (this.$trigger == null) return
        return drag.isDragging(this.$trigger)
    }

    addTriggerControl(enableRefreshDisplay, onUpdateCallback) {
        if (enableRefreshDisplay === undefined)
            enableRefreshDisplay = false
        const cnv = app.canvas_mk
        const $trigger = $('#trigger_plot_').clone();
        const id = $trigger.attr('id') + this.channel.channelId
        $trigger.attr('id', id);
        $trigger.find('.trigger-plot-back-symbol')
            .css('color', this.channel.color)
        $('body').append($trigger);

        const updateTrigger = (deltas, base) => {
            var triggerY = this.channel.view.voltOffset(base)
            triggerY += deltas.dy
            const triggerValue = vround(
                this.channel.view.offsetToVolt(triggerY))
            this.channel.trigger.threshold = triggerValue
            if (onUpdateCallback !== undefined && onUpdateCallback != null)
                onUpdateCallback()
        }

        drag.addDragControl(
            id,
            drag.props(
                0,
                0,
                null,
                null,
                () => this.channel.trigger.threshold,
                null, // start
                // moving
                (deltas, base) => {
                    updateTrigger(deltas, base)
                    if (enableRefreshDisplay)
                        oscilloscope.refreshView()
                },
                null
            )) // moved        

        $trigger.removeClass('hidden');
        this.$trigger = $trigger
    }

    removeTriggerControl() {
        if (this.$trigger != null) {
            this.$trigger.remove()
            this.$trigger = null
        }
    }

    setTriggerControlVisibility(vis) {
        if (this.$trigger == null) return
        if (vis)
            this.$trigger.removeClass('hidden')
        else
            this.$trigger.addClass('hidden')
    }

    setTriggerControl(on, enableRefreshDisplay, onUpdateCallback) {
        this.removeTriggerControl()
        if (on) {
            this.addTriggerControl(enableRefreshDisplay, onUpdateCallback)
        }
    }

    setTriggerControlPos(y) {
        if (this.$trigger == null) return
        const offset = this.$trigger.offset()
        this.$trigger.css('left', offset.left);
        this.$trigger.css('top', y);
    }

    triggerView(channel, drawContext, props) {
        if (channel.trigger.isOn) {
            const triggerY = channel.view.voltOffset(
                channel.trigger.threshold)
            if (!channel.markers.isDraggingTrigger()) {
                // setup the trigger marker                
                channel.markers.setTriggerControlPos(triggerY + settings.markers.trigger.yRel)
            }
            if (channel.markers.isDraggingTrigger()
                || this.trigger) {
                // drag trigger view
                var o = settings.markers.lines.trigger
                this.drawAxe(drawContext, triggerY,
                    o.dash,
                    setRgbaOpacity(o.color, o.opacity),
                    o.width,
                    props
                )
                const triggerSY = channel.view.voltOffset(
                    channel.trigger.threshold + channel.trigger.sensitivity)
                o = settings.markers.lines.triggerS
                this.drawAxe(drawContext, triggerSY,
                    o.dash,
                    setRgbaOpacity(o.color, o.opacity),
                    o.width,
                    props
                )
            }
        }
    }

    axesView(channel, drawContext, props) {
        const avgDash = settings.markers.lines.avgDash
        const limDash = settings.markers.lines.limDash
        const width = settings.markers.lines.width
        if (this.vAvg) {
            var y = channel.view.voltOffset(channel.measures.vAvg)
            this.drawAxe(drawContext, y, avgDash,
                setRgbaOpacity(channel.color, settings.markers.lines.avgOpacity),
                width, props)
        }
        if (this.vMin) {
            var y = channel.view.voltOffset(channel.measures.vMin)
            this.drawAxe(drawContext, y, limDash,
                setRgbaOpacity(channel.color, settings.markers.lines.limOpacity),
                width, props)
        }
        if (this.vMax) {
            var y = channel.view.voltOffset(channel.measures.vMax)
            this.drawAxe(drawContext, y, limDash,
                setRgbaOpacity(channel.color, settings.markers.lines.limOpacity),
                width, props)
        }
    }

    drawAxe(drawContext, y, dash, color, width, props) {
        drawContext.beginPath();
        drawContext.moveTo(0, y)
        drawContext.lineTo(props.canvasWidth, y)
        drawContext.lineWidth = 1;
        drawContext.strokeStyle = color
        if (dash != null)
            drawContext.setLineDash(dash);
        drawContext.stroke()
    }
}
