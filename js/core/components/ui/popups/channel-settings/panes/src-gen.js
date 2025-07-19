// channel settings pane SRC GEN
class ChannelSettingsPaneSrcGen {

    channelSettings = null

    tabs = []
    fnMap = [
        [Gen_Fn_Sin, 'btn_ch_gen_sine'],
        [Gen_Fn_Square, 'btn_ch_gen_square'],
        [Gen_Fn_Sawtooth, 'btn_ch_gen_sawt'],
        [Gen_Fn_Triangle, 'btn_ch_gen_triang']
    ]
    fns = {}

    init(channelSettings) {
        this.channelSettings = channelSettings
        const refresh = () => app.requestAnimationFrame();
        const refreshOnUpdate = { onChange: refresh }

        this.fnMap.forEach(t => {
            this.tabs.push(t[1])
            this.fns[t[0]] = t[1]
        })

        ui
            .tabs.initTabs(this.tabs, {
                onChange: $c => {
                    this.tabChanged($c)
                }
            })
            .toggles.initToggle('btn_ch_src_gen_onoff',
                () => ui.channels.updatePause(this.channelSettings.editChannel),
                'ui.channels.popupSettings.editChannel.pause',
                true)
            .bindings.bind(ui.bindings.binding(
                'opt_ch_gen_frq',
                'ui.channels.popupSettings.editChannel.generator.frequency',
                { onPostChanged: (v) => this.setFrequency(v) }))

        this.setFn(settings.generator.defaultFn)

        return this
    }

    tabChanged($t) {
        const fnId = $t.text()
        this.setFn(fnId)
    }

    setup(channel) {
        this.setFn(channel.generator.fnId)
        this.setFrequency(channel.generator.frequency)
    }

    setFn(fnId) {
        const tabId = this.fns[fnId]
        ui.tabs.selectTab(tabId, this.tabs)
        const channel = ui.channels.popupSettings.editChannel
        if (channel == null) return
        channel.generator.activateFn(fnId)
    }

    setFrequency(v) {
        const channel = ui.channels.popupSettings.editChannel
        if (channel == null) return
        channel.generator.frequency = eval(v)
        const binding = ui.bindings.getBinding('opt_ch_gen_frq')
        binding.init()
        channel.generator.setFrequency(v)
    }

    updatePause(channel) {
        ui.toggles.updateToggle('btn_ch_src_gen_onoff')
    }
}
