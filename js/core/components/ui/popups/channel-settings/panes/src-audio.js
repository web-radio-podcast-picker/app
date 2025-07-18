// channel settings pane SRC AUDIO
class ChannelSettingsPaneSrcAudio {

    channelSettings = null
    audioSrcMap = {}
    audioSrcTabs = []
    srcMap = [
        [Source_Id_AudioInput, 'btn_ch_src_audio'],
        [Source_Id_Ext, 'btn_ch_src_ext'],
        [Source_Id_Generator, 'btn_ch_src_gen'],
        [Source_Id_Math, 'btn_ch_src_math'],
    ]

    init(channelSettings) {
        this.channelSettings = channelSettings

        this.srcMap.forEach(t => {
            this.audioSrcMap[t[0]] = t[1]
            this.audioSrcTabs.push(t[1])
        });

        const readOnly = { readOnly: true, attr: 'text' };
        if (!settings.extInput.enabled)
            $('#btn_ch_src_ext').addClass('menu-item-disabled')

        ui
            .initTabs(this.audioSrcTabs,
                { onChange: async ($c) => this.tabChanged($c) })
            .initToggle('btn_ch_src_audio_onoff',
                () => ui.channels.updatePause(this.channelSettings.editChannel),
                'ui.channels.popupSettings.editChannel.pause',
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

    setup(channel) {
        ui.selectTab(
            this.audioSrcMap[channel.sourceId],
            this.audioSrcTabs)
    }

    updatePause(channel) {
        ui.updateToggle('btn_ch_src_audio_onoff')
    }

    async tabChanged($c) {
        const channelSourceId = $c.text()
        const channel = this.channelSettings.editChannel
        await app.setChannelSource(channel, channelSourceId)
        ui.channels.updatePause(channel)
        this.channelSettings.setupChannelSettingsPane(channel)
    }
}
