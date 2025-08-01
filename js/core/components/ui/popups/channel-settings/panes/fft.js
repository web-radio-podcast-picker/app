/*
    Sound card Oscilloscope Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find licence and copyright informations in files /COPYRIGHT and /LICENCE
*/

// channel settings pane FFT

class ChannelSettingsPaneFFT {

    channelSettings = null

    init(channelSettings) {
        this.channelSettings = channelSettings

        ui.toggles.initToggle('btn_ch_fft_onoff',
            () => oscilloscope.refreshView(),
            ui.getCurrentChannelPath('fftView.visible')
        )
    }
}
