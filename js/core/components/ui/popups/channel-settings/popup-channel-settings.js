/*
    Sound card Oscilloscope | Spectrum Analyzer | Signal Generator
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

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
        const t = this
        ui.tabs.initTabs(this.tabs, {
            onPostChange: $c => t.tabChanged($c)
        })

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
        this.paneSrcGen.setup(channel)
        this.paneTrig.setup(channel)

        ui.toggles.updateToggles()
    }

    toggleChannelSettings(channel) {
        const curCh = this.editChannel
        if (this.editChannel != null) {
            ui.popups.togglePopup(null, 'channel_settings_pane', false)
            this.editChannel = null
        }
        if (channel != curCh) {
            this.editChannel = channel
            this.setupChannelSettingsPane(channel)
            ui.popups.togglePopup(null, 'channel_settings_pane', true, Align_Center_Top)
        }
    }

    updatePause(channel) {
        this.paneSrcAudio.updatePause()
        this.paneSrcGen.updatePause()
        this.paneSrcMath.updatePause()
        this.paneOut.updateOn()
    }

    tabChanged($c) {
        ui.popups.updatePopupsPositionAndSize()
    }
}
