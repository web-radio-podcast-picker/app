// popup settings

class PopupSettings {

    init() {

        const refresh = () => app.requestAnimationFrame();
        const refreshOnUpdate = { onChange: refresh };
        const readOnly = { readOnly: true };

        ui
            // groups
            .initTabs([
                'btn_os_grid',
                'btn_os_disp',
                'btn_os_in',
                'btn_os_out'])

            // display
            .bindings.bind(ui.bindings.binding(
                'opt_os_mrr',
                'settings.ui.maxRefreshRate', {
                ...refreshOnUpdate,
                ...{ input: { delta: 1 } }
            }))
            .bindings.bind(ui.bindings.binding(
                'opt_os_clientWidthBorder',
                'settings.ui.clientWidthBorder',
                refreshOnUpdate))
            .bindings.bind(ui.bindings.binding(
                'opt_os_clientHeightBorder',
                'settings.ui.clientHeightBorder',
                refreshOnUpdate))
            .bindings.bind(ui.bindings.binding(
                'opt_os_menuContainerWidth',
                'settings.ui.menuContainerWidth',
                refreshOnUpdate))

            // input
            .bindings.bind(ui.bindings.binding(
                'opt_os_smpfrqcy',
                'app.audioInputChannel.streamSource.context.sampleRate',
                readOnly))
            .bindings.bind(ui.bindings.binding(
                'opt_os_inputChannelsCount',
                'settings.audioInput.channelsCount',
                readOnly))
            .bindings.bind(ui.bindings.binding(
                'opt_os_frequencyBinCount',
                'app.audioInputChannel.analyzer.frequencyBinCount',
                readOnly))
            .bindings.bind(ui.bindings.binding(
                'opt_os_inputVscale',
                'settings.audioInput.vScale'))

            // output
            .bindings.bind(ui.bindings.binding(
                'opt_os_outputChannelsCount',
                'windowAudioContext.destination.maxChannelCount',
                readOnly))
            .bindings.bind(ui.bindings.binding(
                'opt_os_channelInterpretation',
                'windowAudioContext.destination.channelInterpretation',
                readOnly))
            .bindings.bind(ui.bindings.binding(
                'opt_os_outputVscale',
                'settings.output.vScale'))

            // grid
            .bindings.bind(ui.bindings.binding(
                'opt_os_dv',
                'settings.oscilloscope.vPerDiv',
                { input: { delta: 0.1 } }))
            .bindings.bind(ui.bindings.binding(
                'opt_os_dt',
                'settings.oscilloscope.tPerDiv',
                { input: { delta: 0.1 } }))
            .bindings.bind(ui.bindings.binding(
                'opt_os_hdiv',
                'settings.oscilloscope.grid.hDivCount'))
            .bindings.bind(ui.bindings.binding(
                'opt_os_vdiv',
                'settings.oscilloscope.grid.vDivCount'))
    }
}