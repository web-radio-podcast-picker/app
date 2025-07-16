// popup channel settings

class PopupChannelSettings {

    editChannel = null      // edited channel if any

    paneSrcAudio = new ChannelSettingsPaneSrcAudio()
    paneSrcExt = new ChannelSettingsPaneSrcExt()
    paneSrcGen = new ChannelSettingsPaneSrcGen()
    paneSrcMath = new ChannelSettingsPaneSrcMath()
    paneDisp = new ChannelSettingsPaneDisp()
    paneTrig = new ChannelSettingsPaneTrig()
    paneFft = new ChannelSettingsPaneFFT()
    paneOut = new ChannelSettingsPaneOut()
    paneFilt = new ChannelSettingsPaneFilt()
    paneEff = new ChannelSettingsPaneEff()

    tabs = ['btn_ch_src',
        'btn_ch_disp',
        'btn_ch_trig',
        'btn_ch_fft',
        'btn_ch_out',
        'btn_ch_filt',
        'btn_ch_eff']

    init() {
        const $channelLabel = $('#channel_settings_label')
        $channelLabel.on('click', () => {
            this.toggleChannelSettings(this.editChannel)
        })
        this.initTabs()
    }

    initTabs() {
        ui.initTabs(this.tabs)

        this.paneSrcAudio.init(this)
        this.paneSrcExt.init(this)
        this.paneSrcGen.init(this)
        this.paneSrcMath.init(this)
        this.paneDisp.init(this)
        this.paneTrig.init(this)
        this.paneFft.init(this)
        this.paneOut.init(this)
        this.paneFilt.init(this)
        this.paneEff.init(this)

        return this
    }

    setupChannelSettingsPane(channel) {
        const $channelLabel = $('#channel_settings_label')
        const id = channel.channelId
        ui.channels.setupChannelLabel($channelLabel, id, channel)
        this.paneSrcAudio.setup(channel)
        ui.updateToggles()
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

    updatePause(channel) {
        this.paneSrcAudio.updatePause()
        this.paneSrcGen.updatePause()
        this.paneSrcMath.updatePause()
    }

    tabChanged($c) {

    }
}
