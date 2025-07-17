// channel settings pane OUT
class ChannelSettingsPaneOut {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings

        ui.initToggle('btn_ch_out_onoff',
            ($c) => {
                this.setOut(
                    ui.channels.popupSettings.editChannel,
                    $c.hasClass('on')
                )
            },
            'ui.channels.popupSettings.editChannel.out'
        )

        return this
    }

    setOut(channel, on) {
        oscilloscope.setOut(channel, on)
        ui.updateToggle('btn_ch_out_onoff')
    }
}
