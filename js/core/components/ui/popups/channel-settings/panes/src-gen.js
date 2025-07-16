// channel settings pane SRC GEN
class ChannelSettingsPaneSrcGen {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings

        ui.initToggle('btn_ch_src_gen_onoff',
            () => ui.channels.updatePause(this.channelSettings.editChannel),
            'ui.channels.popupSettings.editChannel.view.pause',
            true
        )

        return this
    }

    updatePause(channel) {
        ui.updateToggle('btn_ch_src_gen_onoff')
    }
}
