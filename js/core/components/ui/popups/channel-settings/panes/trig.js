/*
    Sound card Oscilloscope Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// channel settings pane TRIG
class ChannelSettingsPaneTrig {

    channelSettings = null
    tabs = [
        'btn_ch_trg_up',
        'btn_ch_trg_down'
    ]
    tabs = []
    fnMap = [
        [Trigger_Type_Up, 'btn_ch_trg_up'],
        [Trigger_Type_Down, 'btn_ch_trg_down']
    ]
    fns = {}

    init(channelSettings) {
        this.channelSettings = channelSettings
        const channel = ui.getCurrentChannelPath()

        this.fnMap.forEach(t => {
            this.tabs.push(t[1])
            this.fns[t[0]] = t[1]
        })

        ui
            .toggles.initToggle('btn_ch_trg_onoff',
                () => this.toggleTrigger(),
                ui.getCurrentChannelPath('trigger.isOn')
            )
            .tabs.initTabs(this.tabs, {
                onChange: $c => {
                    this.tabChanged($c)
                }
            })
            .bindings.bind(ui.bindings.binding(
                'opt_ch_trig_tre',
                channel + 'trigger.threshold',
                {
                    input: {
                        delta: 0.1,
                        min: null,
                        max: null
                    }
                }))
            .bindings.bind(ui.bindings.binding(
                'opt_ch_trig_sen',
                channel + 'trigger.sensitivity',
                {
                    input: {
                        delta: 0.1,
                        min: 0,
                        max: null
                    }
                }))
            .bindings.bind(ui.bindings.binding(
                'opt_ch_trig_tsen',
                channel + 'trigger.timeThreshold',
                {
                    input: {
                        delta: 1,
                        min: 0,
                        max: null
                    }
                }))
            .bindings.bind(ui.bindings.binding(
                'opt_ch_trig_tv',
                channel + 'trigger.triggeredV',
                {
                    attr: 'text',
                    readOnly: true,
                    input: {
                        delta: 1,
                        min: 0,
                        max: null
                    }
                }))

        this.setType(settings.trigger.defaultType)

        return this
    }

    toggleTrigger() {
        const channel = ui.getCurrentChannel()
        if (channel == null) return
        channel.markers.setTriggerControl(
            channel.trigger.isOn,
            true,
            () => ui.bindings.updateBindingTarget('opt_ch_trig_tre')
        )
        if (channel.trigger.isOn)
            oscilloscope.refreshView()
    }

    tabChanged($t) {
        const typeId = $t.text()
        this.setType(typeId)
    }

    setType(typeId) {
        const tabId = this.fns[typeId]
        ui.tabs.selectTab(tabId, this.tabs)
        const channel = ui.getCurrentChannel()
        if (channel == null) return
        channel.trigger.type = typeId
    }

    setup(channel) {
        this.setType(channel.trigger.type)
    }
}
