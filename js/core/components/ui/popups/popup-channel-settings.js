// popup channel settings

class PopupChannelSettings {

    editChannel = null      // edited channel if any

    initChannelSettingsPane() {
        const $channelLabel = $('#channel_settings_label')
        $channelLabel.on('click', () => {
            this.toggleChannelSettings(this.editChannel)
        })
        ui.initTabs(
            'btn_ch_src',
            'btn_ch_disp',
            'btn_ch_trig',
            'btn_ch_fft',
            'btn_ch_out',
            'btn_ch_filt',
            'btn_ch_eff'
        )
    }

    setupChannelSettingsPane(channel) {
        const $channelLabel = $('#channel_settings_label')
        const id = channel.channelId
        ui.channels.setupChannelLabel($channelLabel, id, channel)
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
