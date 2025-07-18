// channel settings pane SRC MATH
class ChannelSettingsPaneSrcMath {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings

        ui.toggles.initToggle('btn_ch_src_math_onoff',
            () => ui.channels.updatePause(this.channelSettings.editChannel),
            'ui.channels.popupSettings.editChannel.pause',
            true
        )

        return this
    }

    updatePause(channel) {
        ui.toggles.updateToggle('btn_ch_src_math_onoff')
    }
}
