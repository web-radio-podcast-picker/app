// channel settings pane FILT
class ChannelSettingsPaneFilt {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings

        ui.initToggle('btn_ch_filt_onoff',
            () => { }
        )
        return this
    }
}
