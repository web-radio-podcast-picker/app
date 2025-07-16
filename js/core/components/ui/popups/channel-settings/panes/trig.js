// channel settings pane TRIG
class ChannelSettingsPaneTrig {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings

        ui.initToggle('btn_ch_trg_onoff',
            () => { }
        )
        return this
    }
}
