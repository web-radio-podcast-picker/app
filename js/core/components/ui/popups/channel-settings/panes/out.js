// channel settings pane OUT
class ChannelSettingsPaneOut {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings

        ui.toggles.initToggle('btn_ch_out_onoff',
            ($c) => {
                const channel = ui.channels.popupSettings.editChannel
                const isOn = $c.hasClass('on')
                if ((channel.pause || oscilloscope.pause) && isOn) {
                    // avoid change
                    channel.out = false
                    this.updateOn()
                }
                else
                    this.setOut(channel, isOn)
            },
            'ui.channels.popupSettings.editChannel.out'
        )

        return this
    }

    setOut(channel, on) {
        oscilloscope.setOut(channel, on)
        this.updateOn()
    }

    updateOn() {
        ui.toggles.updateToggle('btn_ch_out_onoff',
            ui.channels.popupSettings.editChannel.out &&
            !ui.channels.popupSettings.editChannel.outMute
        )
    }
}
