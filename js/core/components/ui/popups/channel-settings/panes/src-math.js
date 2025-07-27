// channel settings pane SRC MATH
class ChannelSettingsPaneSrcMath {

    me = new MathExpr().init()
    channelSettings = null
    kbd = [
        'btn_ch_math_k_add',
        'btn_ch_math_k_min',
        'btn_ch_math_k_mul',
        'btn_ch_math_k_div',
        'btn_ch_math_k_dot',
        'btn_ch_math_k_0',
        'btn_ch_math_k_1',
        'btn_ch_math_k_2',
        'btn_ch_math_k_3',
        'btn_ch_math_k_4',
        'btn_ch_math_k_5',
        'btn_ch_math_k_6',
        'btn_ch_math_k_7',
        'btn_ch_math_k_8',
        'btn_ch_math_k_9',
    ]
    tags = [Kbd_Op, Kbd_Num, Kbd_Dot, Kbd_Ch]
    disCl = 'menu-item-disabled'

    init(channelSettings) {
        this.channelSettings = channelSettings

        ui.toggles.initToggle('btn_ch_src_math_onoff',
            () => ui.channels.updatePause(this.channelSettings.editChannel),
            ui.getCurrentChannelPath('pause'),
            true
        )
        this.kbd.forEach(x => {
            $('#' + x).on('click', e => {
                this.clicKbd(e)
            })
        })
        this.setupKbd()

        return this
    }

    addExpr(e, tag) {
        const $c = $('#opt_ch_math_expr')
        var txt = $c.attr('value')
        this.me.setLast(tag)
        if (txt == null || txt === undefined) txt = ''
        txt += e
        $c.attr('value', txt)
    }

    clicKbd(e) {
        const $c = $(e.target)
        if ($c.hasClass(this.disCl))
            return
        const op = $c.text()
        var tag = $c.attr('tag')
        const dtag = $c.attr('data-tag')
        if (dtag !== undefined)
            tag = dtag
        this.addExpr(op, tag)
        this.setupKbd()
    }

    setupKbd() {
        var ns = this.me.getNexts()
        if (ns == null) ns = []
        const $k = $('#kbd_me')
        this.tags.forEach(t => {
            const $c = $k.find('[tag="' + t + '"]')
            $.each($c, (i, e) => {
                const $e = $(e)
                const a = $e.attr('tag')
                if (ns.includes(a))
                    $c.removeClass(this.disCl)
                else
                    $c.addClass(this.disCl)
            })
        })
    }

    updatePause(channel) {
        ui.toggles.updateToggle('btn_ch_src_math_onoff')
    }
}
