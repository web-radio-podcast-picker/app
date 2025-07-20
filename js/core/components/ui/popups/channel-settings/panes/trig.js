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

        this.fnMap.forEach(t => {
            this.tabs.push(t[1])
            this.fns[t[0]] = t[1]
        })

        ui
            .toggles.initToggle('btn_ch_trg_onoff',
                () => { },
                'ui.channels.popupSettings.editChannel.trigger.isOn'
            )
            .tabs.initTabs(this.tabs, {
                onChange: $c => {
                    this.tabChanged($c)
                }
            })

        this.setType(settings.trigger.defaultType)

        return this
    }

    tabChanged($t) {
        const typeId = $t.text()
        this.setType(typeId)
    }

    setType(typeId) {
        const tabId = this.fns[typeId]
        ui.tabs.selectTab(tabId, this.tabs)
        const channel = ui.channels.popupSettings.editChannel
        if (channel == null) return
        channel.trigger.type = typeId
    }

    setup(channel) {
        this.setType(channel.trigger.type)
    }
}
