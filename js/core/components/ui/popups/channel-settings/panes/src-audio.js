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
            .tabs.initTabs(this.audioSrcTabs,
                {
                    onChange: async ($c) => this.tabChanged($c),
                    onPostChange: $c => this.tabPostChanged($c)
                })
            .toggles.initToggle('btn_ch_src_audio_onoff',
                () => ui.channels.updatePause(this.channelSettings.editChannel),
                ui.getCurrentChannelPath('pause'),
                true
            )
            .bindings.bind(ui.bindings.binding(
                'opt_ch_os_smpfrqcy',
                'app.audioInputChannel.streamSource.context.sampleRate',
                readOnly))
            .bindings.bind(ui.bindings.binding(
                'opt_ch_os_frequencyBinCount',
                'app.audioInputChannel.analyzer.frequencyBinCount',
                readOnly))
            .bindings.bind(ui.bindings.binding(
                'opt_ch_os_inputChannelsCount',
                'settings.audioInput.channelsCount',
                readOnly))
            .bindings.bind(ui.bindings.binding(
                'opt_ch_os_inputVscale',
                'settings.audioInput.vScale',
                readOnly))
            .bindings.bind(ui.bindings.binding(
                'opt_ch_src_gain',
                ui.getCurrentChannelPath('gainValue'),
                {
                    onPostChanged: (v) => this.setGain(v),
                    input: {
                        delta: 0.1,
                        min: 0,
                        max: null
                    }
                }))

        this.setGain(1)

        return this
    }

    setGain(v) {
        const channel = ui.getCurrentChannel()
        if (channel == null) return
        const valst = xeval(v)
        if (valst.success) {
            channel.setGain(eval(valst.value))
        }
        const binding = ui.bindings.getBinding('opt_ch_src_gain')
        binding.init()
    }

    setup(channel) {
        ui.tabs.selectTab(
            this.audioSrcMap[channel.sourceId],
            this.audioSrcTabs)
        this.setGain(channel.gainValue)
    }

    updatePause(channel) {
        ui.toggles.updateToggle('btn_ch_src_audio_onoff')
    }

    async tabChanged($c) {
        const channelSourceId = $c.text()
        const channel = this.channelSettings.editChannel
        await app.setChannelSource(channel, channelSourceId)
        ui.channels.updatePause(channel)
        this.channelSettings.setupChannelSettingsPane(channel)
    }

    tabPostChanged($c) {
        ui.popups.updatePopupsPositionAndSize()
    }
}
