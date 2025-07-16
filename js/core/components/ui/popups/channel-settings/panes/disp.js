// channel settings pane DISP
class ChannelSettingsPaneDisp {

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

        ui.initTabs(this.audioSrcTabs)
            .initToggle('btn_ch_disp_onoff',
                () => ui.channels.updateVisible(this.channelSettings.editChannel),
                'ui.channels.popupSettings.editChannel.view.visible'
            )

        return this
    }

    setup(channel) {
        ui.selectTab(
            this.audioSrcMap[channel.sourceId],
            this.audioSrcTabs)
    }

    updateVisible() {
        ui.updateToggle('btn_ch_disp_onoff')
    }
}
