// channel settings pane OUT
class ChannelSettingsPaneOut {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings

        ui.initToggle('btn_ch_out_onoff',
            () => { }
        )
        return this
    }
}
