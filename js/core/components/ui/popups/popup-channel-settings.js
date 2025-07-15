// popup channel settings

class PopupChannelSettings {

    editChannel = null      // edited channel if any

    initChannelSettingsPane() {
        const $channelLabel = $('#channel_settings_label')
        $channelLabel.on('click', () => {
            this.toggleChannelSettings(this.editChannel)
        })
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
