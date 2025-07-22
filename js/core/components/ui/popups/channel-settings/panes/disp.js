// channel settings pane DISP
class ChannelSettingsPaneDisp {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings

        ui
            .toggles.initToggle('btn_ch_disp_onoff',
                () => ui.channels.updateVisible(this.channelSettings.editChannel),
                ui.getCurrentChannelPath('view.visible')
            )
            .toggles.initToggle('opt_ch_disp_tempcol_onoff',
                () => oscilloscope.refreshView(),
                ui.getCurrentChannelPath('tempColor')
            )

        return this
    }

    updateVisible() {
        ui.toggles.updateToggle('btn_ch_disp_onoff')
    }
}
