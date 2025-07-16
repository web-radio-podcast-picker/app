// channel settings pane SRC AUDIO
class ChannelSettingsPaneSrcAudio {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings

        const readOnly = { readOnly: true, attr: 'text' };
        if (!settings.extInput.enabled)
            $('#btn_ch_src_ext').addClass('menu-item-disabled')

        ui.initToggle('btn_ch_src_audio_onoff',
            () => ui.channels.updatePause(this.channelSettings.editChannel),
            'ui.channels.popupSettings.editChannel.view.pause',
            true
        )
            .bind(ui.binding(
                'opt_ch_os_smpfrqcy',
                'app.audioInputChannel.streamSource.context.sampleRate',
                readOnly))
            .bind(ui.binding(
                'opt_ch_os_frequencyBinCount',
                'app.audioInputChannel.analyzer.frequencyBinCount',
                readOnly))
            .bind(ui.binding(
                'opt_ch_os_inputChannelsCount',
                'settings.audioInput.channelsCount',
                readOnly))
            .bind(ui.binding(
                'opt_ch_os_inputVscale',
                'settings.audioInput.vScale',
                readOnly))
        return this
    }

    updatePause() {
        ui.updateToggle('btn_ch_src_audio_onoff')
    }
}
