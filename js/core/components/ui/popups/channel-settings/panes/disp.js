// channel settings pane DISP
class ChannelSettingsPaneDisp {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings

        ui.initToggle('btn_ch_disp_onoff',
            () => ui.channels.toggleVisible(this.channelSettings.editChannel)
        )
        return this
    }
}
