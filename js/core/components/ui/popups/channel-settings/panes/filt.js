/*
    Web Radio | Podcast
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// channel settings pane FILT
class ChannelSettingsPaneFilt {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings

        ui.toggles.initToggle('btn_ch_filt_onoff',
            () => { }
        )
        return this
    }
}
