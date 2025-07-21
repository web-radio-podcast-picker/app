// channel markers

class Markers {

    $trigger = null

    init(channel) {
        this.channel = channel
        return this
    }

    isDraggingTrigger() {
        if (this.$trigger == null) return
        return drag.isDragging(this.$trigger)
    }

    addTriggerControl(enableRefreshDisplay) {
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
            var triggerY = this.channel.view.getVoltOffset(base)
            triggerY += deltas.dy
            const triggerValue = vround(
                this.channel.view.offsetToVolt(triggerY))
            this.channel.trigger.threshold = triggerValue
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

    setTriggerControl(on, enableRefreshDisplay) {
        this.removeTriggerControl()
        if (on) {
            this.addTriggerControl(enableRefreshDisplay)
        }
    }

    setTriggerControlPos(y) {
        if (this.$trigger == null) return
        const offset = this.$trigger.offset()
        this.$trigger.css('left', offset.left);
        this.$trigger.css('top', y);
    }
}
