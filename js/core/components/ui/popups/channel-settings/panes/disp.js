// channel settings pane DISP
class ChannelSettingsPaneDisp {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings

        ui.initToggle('btn_ch_disp_onoff',
            () => ui.channels.updateVisible(this.channelSettings.editChannel),
            'ui.channels.popupSettings.editChannel.view.visible'
        )

        return this
    }

    updateVisible() {
        ui.updateToggle('btn_ch_disp_onoff')
    }
}
