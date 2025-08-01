/*
    Sound card Oscilloscope | Signal Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

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
            ui.getCurrentChannelPath('out')
        )

        return this
    }

    setOut(channel, on) {
        oscilloscope.setOut(channel, on)
        this.updateOn()
    }

    updateOn() {
        const channel = ui.getCurrentChannel()
        if (channel == null) return
        ui.toggles.updateToggle('btn_ch_out_onoff',
            channel.out &&
            !channel.outMute
        )
    }
}
