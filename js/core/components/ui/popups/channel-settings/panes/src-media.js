/*
    Web Radio | Podcast
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// channel settings pane SRC MEDIA

class ChannelSettingsPaneSrcMedia {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings

        ui
            .toggles.initToggle('btn_ch_src_media_onoff',
                () => ui.channels.updatePause(this.channelSettings.editChannel),
                ui.getCurrentChannelPath('pause'),
                true)
            .bindings.bind(ui.bindings.binding(
                'opt_ch_media_url',
                ui.getCurrentChannelPath('mediaSource.url'),
                { disableInputWidget: true, sym: "'" }))

        $('#bt_ch_src_play').on('click', () => {
            app.updateChannelMedia(
                this.channelSettings.editChannel,
                $('#opt_ch_media_url')[0].value
            )
        })

        $('#bt_ch_src_media_url_paste').on('click', async () => {
            const $i = $('#opt_ch_media_url')
            const text = await navigator.clipboard.readText();
            $i[0].value = text
        })

        $('#bt_ch_src_media_url_copy').on('click', () => {
            const text = $('#opt_ch_media_url')[0].value
            navigator.clipboard.writeText(text)
        })

        $('#bt_ch_src_media_peekwr').on('click', () => {
            // open module: web-radio-picker
            app.openModule('web-radio-picker',
                app.moduleLoader.opts(
                    'wrp_mod_inf_txt',
                    'wrp_mod_err_txt'
                )
            )
        })

        return this
    }

    setup(channel) {

    }

    updateURL(url) {
        var channel = this.channelSettings.editChannel
        if (channel == null) channel = app.channel
        if (channel == null) return
        channel.mediaSource.audio.src = url
        channel.mediaSource.url = url
        ui.channels.popupSettings.paneSrcMedia.updateBindings()
    }

    updateBindings() {
        ui.bindings.updateBindingTarget('opt_ch_media_url')
    }

    updatePause(channel) {
        ui.toggles.updateToggle('btn_ch_src_media_onoff')
    }
}
