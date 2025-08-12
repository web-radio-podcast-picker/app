/*
    Sound card Oscilloscope | Signal Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

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
        const refresh = () => oscilloscope.refreshView()
        const refreshOnUpdate = { onChange: refresh }

        this.fnMap.forEach(t => {
            this.tabs.push(t[1])
            this.fns[t[0]] = t[1]
        })

        const channel = ui.getCurrentChannelPath()

        ui
            .tabs.initTabs(this.tabs, {
                onChange: $c => {
                    this.tabChanged($c)
                }
            })
            // frequency
            .toggles.initToggle('btn_ch_src_gen_onoff',
                () => ui.channels.updatePause(this.channelSettings.editChannel),
                channel + 'pause',
                true)
            .bindings.bind(ui.bindings.binding(
                'opt_ch_gen_frq',
                channel + 'generator.frequency',
                { onPostChanged: (v) => this.setFrequency(v) }))
            .toggles.initToggle('btn_ch_gen_frq_onoff',
                () => { this.switchFrq() },
                channel + 'generator.frqOn')

            // modulation frequency
            .toggles.initToggle('btn_ch_gen_mod_frq_onoff',
                () => { this.switchModFrq() },
                channel + 'generator.frqModulationOn')
            .bindings.bind(ui.bindings.binding(
                'opt_ch_gen_mod_frq_min',
                channel + 'generator.modulation.frqMin',
                { onPostChanged: (v) => this.setModulation({ frqMin: v }) }))
            .bindings.bind(ui.bindings.binding(
                'opt_ch_gen_mod_frq_max',
                channel + 'generator.modulation.frqMax',
                { onPostChanged: (v) => this.setModulation({ frqMax: v }) }))
            .bindings.bind(ui.bindings.binding(
                'opt_ch_gen_mod_frq_rate',
                channel + 'generator.modulation.frqRate',
                { onPostChanged: (v) => this.setModulation({ frqRate: v }) }))

            // modulation gain
            .toggles.initToggle('btn_ch_gen_mod_amp_onoff',
                () => { this.switchModAmp() },
                channel + 'generator.ampModulationOn')
            .bindings.bind(ui.bindings.binding(
                'opt_ch_gen_mod_amp_min',
                channel + 'generator.modulation.ampMin',
                { onPostChanged: (v) => this.setModulation({ ampMin: v }) }))
            .bindings.bind(ui.bindings.binding(
                'opt_ch_gen_mod_amp_max',
                channel + 'generator.modulation.ampMax',
                { onPostChanged: (v) => this.setModulation({ ampMax: v }) }))
            .bindings.bind(ui.bindings.binding(
                'opt_ch_gen_mod_amp_rate',
                channel + 'generator.modulation.ampRate',
                { onPostChanged: (v) => this.setModulation({ ampRate: v }) }))

        this.setFn(settings.generator.defaultFn)

        return this
    }

    switchFrq() {
        const channel = ui.getCurrentChannel()
        if (channel == null) return
        channel.generator.frqModulationOn = !channel.generator.frqOn
        this.setModFrq(channel.generator.frqModulationOn)
        this.setFrq(channel.generator.frqOn)
    }

    switchModFrq() {
        const channel = ui.getCurrentChannel()
        if (channel == null) return
        channel.generator.frqOn = !channel.generator.frqModulationOn
        this.setModFrq(channel.generator.frqModulationOn)
        this.setFrq(channel.generator.frqOn)
    }

    switchModAmp() {
        const channel = ui.getCurrentChannel()
        if (channel == null) return
        channel.generator.ampOn = !channel.generator.ampModulationOn
        this.setModAmp(channel.generator.ampModulationOn)
    }

    setFrq(on) {
        const channel = ui.getCurrentChannel()
        if (channel == null) return
        ui.toggles.updateToggle('btn_ch_gen_frq_onoff')
        ui.bindings.updateBindingTarget('opt_ch_gen_frq')
    }

    setModFrq(on) {
        const channel = ui.getCurrentChannel()
        if (channel == null) return
        channel.generator.setupModFrq()
        ui.toggles.updateToggle('btn_ch_gen_mod_frq_onoff')
    }

    setModAmp(on) {
        const channel = ui.getCurrentChannel()
        if (channel == null) return
        channel.generator.setupModAmp()
        ui.toggles.updateToggle('btn_ch_gen_mod_amp_onoff')
    }

    tabChanged($t) {
        const fnId = $t.text()
        this.setFn(fnId)
    }

    setup(channel) {
        this.setFn(channel.generator.fnId)
        this.setFrequency(channel.generator.frequency)
        if (channel.generator.modulation.frqMin == null)
            return
        this.setModulation(channel.generator.modulation)
        this.setFrq(channel.generator.frqOn)
    }

    setFn(fnId) {
        const tabId = this.fns[fnId]
        ui.tabs.selectTab(tabId, this.tabs)
        const channel = ui.getCurrentChannel()
        if (channel == null) return
        channel.generator.activateFn(fnId)
    }

    setFrequency(v) {
        const channel = ui.getCurrentChannel()
        if (channel == null) return
        const valst = xeval(v)
        if (valst.success) {
            channel.generator.frequency = eval(v)
        }
        const binding = ui.bindings.getBinding('opt_ch_gen_frq')
        binding.init()
        channel.generator.setFrequency(v)
    }

    setModulation(props) {
        const channel = ui.getCurrentChannel()
        if (channel == null) return
        channel.generator.setModulation(props)
        // massive display update shortcut
        ui.bindings.initBindedControls()
    }

    updatePause(channel) {
        ui.toggles.updateToggle('btn_ch_src_gen_onoff')
    }
}
