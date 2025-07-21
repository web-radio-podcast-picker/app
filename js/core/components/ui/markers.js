// channel markers

class Markers {

    $trigger = null

    init(channel) {
        this.channel = channel
        return this
    }

    addTriggerControl() {
        const cnv = app.canvas_mk
        const $trigger = $('#trigger_plot_').clone();
        const id = this.channel.channelId;
        $trigger.attr('id', $trigger.attr('id') + id);
        $trigger.find('.trigger-plot-back-symbol')
            .css('color', this.channel.color)
        $('body').append($trigger);
        $trigger.removeClass('hidden');
        this.$trigger = $trigger
    }

    removeTriggerControl() {
        if (this.$trigger != null) {
            this.$trigger.remove()
            this.$trigger = null
        }
    }

    setTriggerControl(on) {
        this.removeTriggerControl()
        if (on) {
            this.addTriggerControl()
        }
    }

    setTriggerControlPos(y) {
        if (this.$trigger == null) return
        const offset = this.$trigger.offset()
        this.$trigger.css('left', offset.left);
        this.$trigger.css('top', y);
    }
}
