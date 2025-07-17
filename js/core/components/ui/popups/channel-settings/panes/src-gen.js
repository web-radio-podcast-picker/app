// channel settings pane SRC GEN
class ChannelSettingsPaneSrcGen {

    channelSettings = null

    tabs = [
        'btn_ch_gen_sine',
        'btn_ch_gen_square',
        'btn_ch_gen_sawt',
        'btn_ch_gen_triang'
    ]

    init(channelSettings) {
        this.channelSettings = channelSettings

        ui.initToggle('btn_ch_src_gen_onoff',
            () => ui.channels.updatePause(this.channelSettings.editChannel),
            'ui.channels.popupSettings.editChannel.pause',
            true)
            .initTabs(this.tabs, {
                onChange: $c => this.tabChanged($c)
            })
        /*.bind(ui.binding(
            'opt_ch_gen_frq',
            'settings.audioInput.vScale',
            readOnly))*/

        return this
    }

    tabChanged($t) {

    }

    updatePause(channel) {
        ui.updateToggle('btn_ch_src_gen_onoff')
    }
}
