// channel settings pane SRC AUDIO
class ChannelSettingsPaneSrcAudio {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings

        const readOnly = { readOnly: true, attr: 'text' };
        if (!settings.extInput.enabled)
            $('#btn_ch_src_ext').addClass('menu-item-disabled')
        ui.bind(ui.binding(
            'opt_ch_os_smpfrqcy',
            'app.audioInputChannel.streamSource.context.sampleRate',
            readOnly));
        ui.bind(ui.binding(
            'opt_ch_os_frequencyBinCount',
            'app.audioInputChannel.analyzer.frequencyBinCount',
            readOnly));
        ui.bind(ui.binding(
            'opt_ch_os_inputChannelsCount',
            'settings.audioInput.channelsCount',
            readOnly));
        ui.bind(ui.binding(
            'opt_ch_os_inputVscale',
            'settings.audioInput.vScale',
            readOnly));
        return this
    }
}
