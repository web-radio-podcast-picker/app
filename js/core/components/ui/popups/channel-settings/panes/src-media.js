/*
    Sound card Oscilloscope | Spectrum Analyzer | Signal Generator
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

//channel settings pane SRC MEDIA

class ChannelSettingsPaneSrcMedia {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings

        ui
            .toggles.initToggle('btn_ch_src_media_onoff',
                () => ui.channels.updatePause(this.channelSettings.editChannel),
                ui.getCurrentChannelPath('pause'),
                true)
            .bindings.bind(ui.bindings.binding(
                'opt_ch_media_url',
                'app.getInputChannel().mediaSource.url',
                { disableInputWidget: true, sym: "'" }))

        $('#bt_ch_src_play').on('click', () => {
            app.updateChannelMedia(
                this.channelSettings.editChannel,
                $('#opt_ch_media_url')[0].value
            )
        })

        return this
    }

    setup(channel) {

    }

    updatePause(channel) {
        ui.toggles.updateToggle('btn_ch_src_media_onoff')
    }
}
