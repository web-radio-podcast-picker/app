// channel settings pane DISP
class ChannelSettingsPaneDisp {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings

        ui.toggles.initToggle('btn_ch_disp_onoff',
            () => ui.channels.updateVisible(this.channelSettings.editChannel),
            ui.getCurrentChannelPath('view.visible')
        )

        return this
    }

    updateVisible() {
        ui.toggles.updateToggle('btn_ch_disp_onoff')
    }
}
