/*
    Sound card Oscilloscope | Signal Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// channel settings pane FFT

class ChannelSettingsPaneFFT {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings
        const fft = ui.getCurrentChannelPath() + 'fft.'
        const sd = ui.isSmallDisplay() ? 'SD' : ''

        ui
            .toggles.initToggle('btn_ch_fft_onoff',
                () => oscilloscope.refreshView(),
                ui.getCurrentChannelPath('fftView.visible')
            )
            .bindings.bind(ui.bindings.binding(
                'opt_ch_fft_hscale',
                fft + 'hScale',
                {
                    input: {
                        delta: 0.1,
                        min: 0,
                        max: null
                    }
                }))
            .bindings.bind(ui.bindings.binding(
                'opt_ch_fft_vscale',
                fft + 'vScale',
                {
                    input: {
                        delta: 0.1,
                        min: 1,
                        max: 2
                    }
                }))
            .bindings.bind(ui.bindings.binding(
                'opt_ch_fft_hdiv',
                fft + 'grid.hDivCount' + sd))
            .bindings.bind(ui.bindings.binding(
                'opt_ch_fft_vdiv',
                fft + 'grid.dbPerDiv' + sd))
    }
}
