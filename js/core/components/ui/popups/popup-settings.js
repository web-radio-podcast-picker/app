/*
    Sound card Oscilloscope | Spectrum Analyzer | Signal Generator
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// popup settings

class PopupSettings {

    tabGroupIndex = 1

    grp1_tabs = [
        'btn_os_grid',
        'btn_os_disp',
        'btn_os_in',
        'btn_os_out',
    ]

    grp2_tabs = [
        'btn_os_sys',
        'btn_os_lice',
        'btn_os_cpyrg',
        'btn_os_spc1'
    ]

    tabChanged = false

    init() {

        const refresh = () => oscilloscope.refreshView()
        const refreshOnUpdate = { onChange: refresh };
        const readOnly = { readOnly: true };

        ui
            // groups
            .tabs.initTabs(this.grp1_tabs)
            .tabs.initTabs(this.grp2_tabs)

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
            .toggles.initToggle('opt_os_ppTrans',
                () => this.setPopupTransparency(),
                'settings.ui.popupTransparency')

            // input
            .bindings.bind(ui.bindings.binding(
                'opt_os_smpfrqcy',
                'app.getInputChannel().analyzer.context.sampleRate',
                readOnly))
            .bindings.bind(ui.bindings.binding(
                'opt_os_inputChannelsCount',
                'settings.audioInput.channelsCount',
                readOnly))
            .bindings.bind(ui.bindings.binding(
                'opt_os_frequencyBinCount',
                'app.getInputChannel().analyzer.frequencyBinCount',
                readOnly))
            .bindings.bind(ui.bindings.binding(
                'opt_os_inputVscale',
                'settings.audioInput.vScale'))
            .bindings.bind(ui.bindings.binding(
                'opt_os_audio_source',
                'audioInputDevice.label',
                {
                    attr: 'text',
                    ...readOnly
                }))

            // output
            .bindings.bind(ui.bindings.binding(
                'opt_os_outputChannelsCount',
                'app.getInputChannel().analyzer.context.destination.maxChannelCount',
                readOnly))
            .bindings.bind(ui.bindings.binding(
                'opt_os_channelInterpretation',
                'app.getInputChannel().analyzer.context.destination.channelInterpretation',
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

            // system
            .bindings.bind(ui.bindings.binding(
                'opt_os_sys_appver',
                'settings.app.version',
                readOnly))
            .bindings.bind(ui.bindings.binding(
                'opt_os_sys_agent',
                'navigator.userAgent',
                {
                    ...readOnly,
                    ...{
                        attr: 'text'
                    }
                }))
            .bindings.bind(ui.bindings.binding(
                'opt_os_sys_reso',
                'cui.viewSize().width+\'x\'+cui.viewSize().height',
                readOnly))
            .bindings.bind(ui.bindings.binding(
                'opt_os_sys_plat',
                'settings.sys.platformText',
                readOnly))

        // toggle tabs groups

        const $tb = $('#btn_os_tgl')
        $tb.on('click', () => {
            const $popup = $('#pop_settings')
            $popup.find('.grp' + this.tabGroupIndex + '')
                .addClass('hidden')
            this.tabGroupIndex++
            if (this.tabGroupIndex > 2)
                this.tabGroupIndex = 1
            $popup.find('.grp' + this.tabGroupIndex + '')
                .removeClass('hidden')

            ui.tabs.setSelectedTabPaneVisibility(
                false,
                this.tabGroupIndex == 2 ? this.grp1_tabs
                    : this.grp2_tabs)

            if (!this.tabChanged) {
                ui.tabs.selectTab('btn_os_sys', this.grp2_tabs)
                this.tabChanged = true
            }

            ui.tabs.setSelectedTabPaneVisibility(
                true,
                this.tabGroupIndex == 1 ? this.grp1_tabs
                    : this.grp2_tabs)

            $('#btn_os_tgl').text(this.tabGroupIndex == 1 ? '▼' : '▲');
        })

        this.setPopupTransparency()
    }

    setPopupTransparency() {
        const cl = 'max-opacity'
        const $p = $('.popup')
        if (settings.ui.popupTransparency)
            $p.removeClass(cl)
        else
            $p.addClass(cl)
    }
}