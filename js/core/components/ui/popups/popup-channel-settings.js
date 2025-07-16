// popup channel settings

class PopupChannelSettings {

    editChannel = null      // edited channel if any

    tabs = ['btn_ch_src',
        'btn_ch_disp',
        'btn_ch_trig',
        'btn_ch_fft',
        'btn_ch_out',
        'btn_ch_filt',
        'btn_ch_eff']

    audioSrcTabs = [
        'btn_ch_src_audio',
        'btn_ch_src_ext',
        'btn_ch_src_gen',
        'btn_ch_src_math'
    ]

    audioSrcMap = {}

    initChannelSettingsPane() {
        const $channelLabel = $('#channel_settings_label')
        $channelLabel.on('click', () => {
            this.toggleChannelSettings(this.editChannel)
        })
        const srcMap = [
            [Source_Id_AudioInput, 'btn_ch_src_audio'],
            [Source_Id_Ext, 'btn_ch_src_ext'],
            [Source_Id_Generator, 'btn_ch_src_gen'],
            [Source_Id_Math, 'btn_ch_src_math'],
        ]
        srcMap.forEach(t => {
            this.audioSrcMap[t[0]] = t[1]
        });
        ui.initTabs(this.tabs)
        ui.initTabs(this.audioSrcTabs)
        if (!settings.extInput.enabled)
            $('#btn_ch_src_ext').addClass('menu-item-disabled')
    }

    setupChannelSettingsPane(channel) {
        const $channelLabel = $('#channel_settings_label')
        const id = channel.channelId
        ui.channels.setupChannelLabel($channelLabel, id, channel)
        this.setupSrc(channel)
    }

    setupSrc(channel) {
        ui.selectTab(
            this.audioSrcMap[channel.sourceId],
            this.audioSrcTabs)
    }

    toggleChannelSettings(channel) {
        const curCh = this.editChannel
        if (this.editChannel != null) {
            ui.togglePopup(null, 'channel_settings_pane', false)
            this.editChannel = null
        }
        if (channel != curCh) {
            this.editChannel = channel
            this.setupChannelSettingsPane(channel)
            ui.togglePopup(null, 'channel_settings_pane', true, 'center-top')
        }
    }
}
