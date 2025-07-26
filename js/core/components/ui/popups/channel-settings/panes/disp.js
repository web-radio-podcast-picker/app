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
            .toggles.initToggle('opt_ch_disp_htempcol_onoff',
                () => oscilloscope.refreshView(),
                ui.getCurrentChannelPath('bright')
            )
            .bindings.bind(ui.bindings.binding(
                'opt_disp_stroke_width',
                ui.getCurrentChannelPath('lineWidth'),
                {
                    input: {
                        delta: 0.5,
                        min: 0,
                        max: 9
                    }
                }))

        return this
    }

    updateVisible() {
        ui.toggles.updateToggle('btn_ch_disp_onoff')
    }
}
