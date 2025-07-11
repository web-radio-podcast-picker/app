// ui

ui = {

    oscilloscope: null,     // reference to the oscilloscope manager
    uiInitialized: false,   // indicates if ui is already globally initialized
    popupId: null,          // any id of an html popupId currently opened/showed
    $inputWidget: null,     // input widget if any
    $inputWidgetLabel: null, // input widget label of edited control if any
    popupCtrlId: null,      // popup control placement if any else null
    bindings: [],           // array of bindings for controls

    init(oscilloscope) {
        this.oscilloscope = oscilloscope;
        this.oscilloscope.channels.forEach(channel => {
            if (!channel.ui) {
                this.init_btns(channel.channelId, channel.view);
                channel.ui = true;
            }
        });
        if (!this.uiInitialized) {
            this.init_ui();
            this.uiInitialized = true;
        }
        console.log("UI initialized");
    },

    init_btns(channel, sigView) {
        // Initialize buttons and other UI elements for a channel

        // channel pause buttons
        const $e = $('#btn_pause_' + channel);
        const fn = () => {
            if (!sigView.pause) {
                $e.text('⏸');
            } else {
                $e.text('▶');
            }
        }
        fn(); // Set initial button text
        $e.on('click', () => {
            sigView.pause = !sigView.pause;
            fn();
        });

        // close
        $('#btn_closech_' + channel).on('click', () => {
            app.deleteChannel(channel);
        });

        // settings
        $('#btn_chsett_' + channel).on('click', () => {
            this.editChannelSettings(channel);
        });

        // visible
        const $vb = $('#btn_viewch_' + channel);
        $vb.on('click', () => {
            $vb.toggleClass('line-through');
            sigView.visible = !sigView.visible;
            app.requestAnimationFrame();
        });
    },

    init_ui() {
        // events
        $(window).resize(() => {
            if (oscilloscope.pause)
                app.requestAnimationFrame();
        });
        // properties
        $('input').attr('autocomplete', 'off');
        this.bind(this.binding(
            'app_ver',
            'settings.app.version',
            { readOnly: true, attr: 'text' }));
        // menus & popups
        this.initRightMenu();
        this.init_popups();
    },

    init_popups() {
        $('.popup-close').on('click', () => {
            const p = this.popupId;
            this.popupId = null;
            this.control = null;
            this.togglePopup(null, p, false);
            this.closeInputWidget();
        });
        this.init_popup_settings();
    },

    init_popup_settings() {

        const refresh = () => app.requestAnimationFrame();
        const refreshOnUpdate = { onChange: refresh };
        const readOnly = { readOnly: true };

        // groups
        this.initTabs(
            'btn_os_grid',
            'btn_os_disp',
            'btn_os_in',
            'btn_os_out');

        // display
        this.bind(this.binding(
            'opt_os_clientWidthBorder',
            'settings.ui.clientWidthBorder',
            refreshOnUpdate));
        this.bind(this.binding(
            'opt_os_clientHeightBorder',
            'settings.ui.clientHeightBorder',
            refreshOnUpdate));
        this.bind(this.binding(
            'opt_os_menuContainerWidth',
            'settings.ui.menuContainerWidth',
            refreshOnUpdate));

        // input
        this.bind(this.binding(
            'opt_os_smpfrqcy',
            'app.audioInputChannel.streamSource.context.sampleRate',
            readOnly));
        this.bind(this.binding(
            'opt_os_inputChannelsCount',
            'settings.audioInput.channelsCount',
            readOnly));
        this.bind(this.binding(
            'opt_os_frequencyBinCount',
            'app.audioInputChannel.analyzer.frequencyBinCount',
            readOnly));
        this.bind(this.binding(
            'opt_os_inputVscale',
            'settings.audioInput.vScale'));

        // output
        this.bind(this.binding(
            'opt_os_outputChannelsCount',
            'oscilloscope.audioContext.destination.maxChannelCount',
            readOnly));
        this.bind(this.binding(
            'opt_os_channelInterpretation',
            'oscilloscope.audioContext.destination.channelInterpretation',
            readOnly));

        // grid
        this.bind(this.binding(
            'opt_os_dv',
            'settings.oscilloscope.vPerDiv',
            { input: { delta: 0.1 } }));
        this.bind(this.binding(
            'opt_os_dt',
            'settings.oscilloscope.tPerDiv',
            { input: { delta: 0.1 } }));
        this.bind(this.binding(
            'opt_os_hdiv',
            'settings.oscilloscope.grid.hDivCount'));
        this.bind(this.binding(
            'opt_os_vdiv',
            'settings.oscilloscope.grid.vDivCount'));
    },

    initBindedControls() {
        // Initialize bindings for UI controls
        this.bindings.forEach(b => {
            if (b.init != null)
                b.init();
        });
        app.updateDisplay();
    },

    binding(controlId, valuePath, t) {
        const r = {
            controlId: controlId,
            valuePath: valuePath,
            sym: null,
            onChanged: null,
            onInit: null,
            readOnly: false,
            unit: '',
            attr: 'value',
            digits: 5,
            input: {
                delta: 1
            }
        };
        return t == null ? r : { ...r, ...t };
    },

    bind(binding) {
        const { controlId, valuePath, sym, onChanged, onInit, readOnly, unit, attr, digits } = binding;
        if (readOnly == null)
            readOnly = false;
        const $c = $('#' + controlId);

        if (readOnly) {
            $c.addClass('read-only');
            $c.attr('readonly', '');
        } else {
            // input widget
            $c.on('click', () => {
                t.openInputWidget(controlId);
            });
        }

        const t = this;
        const fn = () => {
            // initial value
            if (onInit == null) {
                if (attr == 'text')
                    $c.text(eval(valuePath) + unit);
                else
                    $c.attr(attr, eval(valuePath) + unit);
            }
            else
                onInit();
        };
        app.addOnStartUI(() => {
            fn();
        });

        var onChange = () => {
            if (settings.debug.trace)
                console.trace('value changed: ' + controlId);
            const $v = $c[0].value;
            const s = (sym == null)
                ? '' : sym;
            if (onChanged != null)
                onChanged();
            else
                eval(valuePath + '=' + s + $v + s);
            app.updateDisplay();
        };
        this.initBindedControls();

        if (!readOnly) {
            $c.on('change', () => {
                onChange();
            });
        }

        this.bindings.push({ init: fn, onChange: onChange, props: binding });
    },

    getBinding(controlId) {
        var r = null;
        this.bindings.forEach(b => {
            if (b.props.controlId == controlId) {
                r = b;
            }
        });
        return r;
    },

    updateBindingSourceAndTarget(controlId, value) {
        const binding = this.getBinding(controlId);
        const $c = $('#' + controlId);
        $c.attr('value', value);
        binding.onChange();
    },

    initTabs(...tabs) {
        const t = this;
        tabs.forEach(e => {
            const $c = $('#' + e);
            $c.on('click', () => {
                if (!$c.hasClass('selected'))
                    t.selectTab($c.attr('id'), tabs);
            });
        });
    },

    selectTab(selectedTabId, tabs) {
        const panes = [...tabs];
        const btIdToPaneId = t => t.replace('btn_', 'opts_');
        panes.forEach((v, i) => {
            panes[i] = btIdToPaneId(panes[i]);
        });
        const selectedPane = btIdToPaneId(selectedTabId);
        tabs.forEach(e => {
            const $t = $('#' + e);
            const pId = btIdToPaneId(e);
            const $p = $('#' + pId);
            if ($t.hasClass('selected')) {
                $t.removeClass('selected');
                $p.addClass('hidden');
            }
            if ($t.attr('id') == selectedTabId) {
                $t.addClass('selected');
                $p.removeClass('hidden');
            }
        });
        this.closeInputWidget();
    },

    initRightMenu() {
        // menu buttons
        $('#btn_menu').on('click', () => {
            this.toggleMenu();
        });
        $('#btn_add_ch').on('click', async () => {
            if (app.powerOn)
                await app.addChannel();
        });
        $('#btn_restart').on('click', () => {
            if (app.powerOn)
                window.location.reload(false);
        });
        $('#btn_power').on('click', () => {
            app.togglePower();
        });
        $('#btn_opause').on('click', () => {
            app.toggleOPause();
        });
        $('#btn_oset').on('click', () => {
            this.togglePopup(null, 'pop_settings');
            this.closeInputWidget();
        });
    },

    toggleMenu() {
        const $mb = $('#top-right-menu-body');
        $mb.toggleClass('hidden');
        const visible = !$mb.hasClass('hidden');
        $('#btn_menu').text(visible ? '▼' : '▲');
        if (visible)
            this.initBindedControls();

        if (this.popupId != null) {
            const p = this.popupId;
            this.popupId = null;
            this.togglePopup(null, p, false);
            this.closeInputWidget();
        }
    },

    togglePopup(control, popupId, showState) {
        if (this.popupId != null && this.popupId != popupId) {
            // change popup
            const p = this.popupId;
            this.popupId = null;
            this.control = null;
            this.togglePopup(control, p, false);
        }
        const $popup = $('#' + popupId);
        const visible = !$popup.hasClass('hidden');
        this.popupId = null;
        this.popupCtrlId = null;
        if (showState === undefined) {
            $popup.toggleClass('hidden');
            if (!visible) {
                this.popupId = popupId;
                this.popupCtrlId = control;
                this.initBindedControls();
            }
        } else {
            if (!showState)
                $popup.addClass('hidden');
            else {
                $popup.removeClass('hidden');
                this.popupId = popupId;
                this.popupCtrlId = control;
                this.initBindedControls();
            }
        }
        if (this.popupId != null) {
            const w = $popup.width();
            const h = $popup.height();
            var left = 0;
            var top = 0;
            if (control != null) {
                // left align
                const $ctrl = $(control);
                var pos = $ctrl.offset();
                pos.left -= w;
                pos.left -= settings.ui.menuContainerWidth; // 3*1em
                left = pos.left;
                top = pos.top;
            } else {
                // center
                const vs = this.viewSize();
                left = (vs.width - w) / 2.0;
                top = (vs.height - h) / 2.0;
            }
            this.popupCtrlId = control;
            $popup.css('left', left);
            $popup.css('top', top);
        }
    },

    turnOffMenu() {
        const t = ['#btn_add_ch', '#btn_restart', '#btn_opause'];
        t.forEach(b => {
            $(b)
                .toggleClass('menu-item-disabled');
        });
    },

    reflectOscilloPauseState() {
        $('#btn_opause').text(oscilloscope.pause ? '▶' : '⏸');
    },

    closeInputWidget() {
        if (this.$inputWidget != null) {
            this.$inputWidget.remove();
            this.$inputWidget = null;
            if (this.$inputWidgetLabel != null) {
                this.$inputWidgetLabel.toggleClass('opt-label-selected');
                this.$inputWidgetLabel = null;
            }
        }
    },

    openInputWidget(controlId) {
        const t = this;
        this.closeInputWidget();
        const $c = $('#' + controlId);
        const $w = $('#input_widget').clone();
        //const $cnt = $w.find('.input-widget-value-vpane'); 
        const $cnt = $w.find('#iw_vpane');
        const binding = this.getBinding(controlId).props;

        // input,unit,label

        const $i = $c.clone();
        $i.attr('id', null);
        $i.css('width', binding.digits / 1.5 + 'em');
        $i.css('grid-column', 1);
        $i.css('grid-row', 1);
        var nxCol = 2;

        const $p = $c.parent();
        var tc = $i.attr('class').split(' ');
        var isRow = false;
        var row = -1;
        tc.forEach(c => {
            if (c.startsWith('gr')) {
                isRow = true;
                row = parseInt(c.substring(2));
            }
        });
        const $optPane = isRow ? $p : $p.parent();
        if (!isRow) {
            tc = $p.attr('class').split(' ');
            tc.forEach(c => {
                if (c.startsWith('gr'))
                    row = parseInt(c.substring(2));
            });
        }
        const $label = $optPane.find('.gr' + row + '.gc1');
        $label.toggleClass('opt-label-selected');
        this.$inputWidgetLabel = $label;

        const pid = $p.attr('id');
        const hasUnit = pid == null || !pid.startsWith('opts_');
        if (hasUnit) {
            const $u = $c.parent().find('.unit').clone();
            $u.addClass('unit-big');
            $u.css('grid-column', nxCol);
            $u.css('grid-row', 1);
            nxCol++;
            $u.attr('id', null);
            $cnt.prepend($u);
        }
        $cnt.prepend($i);

        // buttons ok,cancel

        const validate = (close) => {
            const val = $i.val();
            t.updateBindingSourceAndTarget(controlId, val);
            if (close == null || close == true)
                t.closeInputWidget();
        };

        const $butOk = $w.find('#btn_valid_ok');
        const $butCancel = $w.find('#btn_valid_cancel');
        $butOk.on('click', () => {
            validate();
        });
        $butCancel.on('click', () => {
            t.closeInputWidget();
        });
        $butOk.attr('id', null);
        $butCancel.attr('id', null);
        $i.on('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                validate();
            }
        });

        // buttons +,-

        const incDecValue = (sign) => {
            const $val = $i.val();
            var v = parseFloat($val);
            v += sign * binding.input.delta;
            v = vround(v);
            v = parseFloat(v);
            $i.val(v);
            validate(false);
        }

        const $butPlus = $w.find('#btn_input_plus');
        const $butMinus = $w.find('#btn_input_minus');
        $butPlus.on('click', () => {
            incDecValue(1);
        });
        $butMinus.on('click', () => {
            incDecValue(-1);
        });

        // input

        $i.on('change', () => {
            validate(false);
        });

        // delta input
        const $inDel = $w.find('#iw_delta');
        $inDel.val(binding.input.delta);

        $('body').append($w);
        var pos = $c.offset();
        $w.css('left', pos.left);
        $w.css('top', pos.top);
        $w.removeClass('hidden');
        $i.focus();
        $i.select();

        this.$inputWidget = $w;
    },

    addControls(channel) {
        const $model = $('#channel_pane').clone();
        $model.removeClass('hidden');
        const id = channel.channelId;
        $model.attr('id', 'channel_pane_' + id);
        const colors = settings.oscilloscope.channels.colors;
        const colLength = colors.length;
        const colIndex = (id - 1) % colLength;
        const col = colors[colIndex];
        $model.css('color', col);
        channel.color = col;
        $channelLabel = $model.find('#channel_label_');
        $channelLabel.attr('id', $channelLabel.attr('id') + id);
        $channelLabel.text('CH' + id);
        const $elems = $model.find('*');
        const $unit = $model.find('.unit');
        $unit.css('color', col);
        $.each($elems, (i, e) => {
            var $e = $(e);
            var eid = $e.attr('id');
            if (eid !== undefined && eid.endsWith('_')) {
                $e.attr('id', eid + id);
            }
            if ($e.hasClass('channel-label')) {
                $e.css('background-color', col);
            }
        });
        $('#channels_infos_deck').append($model);
        $channelShortcut = $channelLabel.clone();
        $channelShortcut.attr('id', 's_' + $channelLabel.attr('id'));
        $channelShortcut.css('grid-column', id);
        const toggleControls = () => {
            $('#channel_pane_' + id).toggleClass('hidden');
        }
        $channelShortcut.on('click', () => {
            toggleControls();
        });
        $channelLabel.on('click', () => {
            toggleControls();
        });

        $('#channels_shortcuts_deck').append($channelShortcut);
    },

    removeControls(channel) {
        // remove the controls for a channel
        const id = channel.channelId;
        $('#channel_pane_' + id).remove();
        $('#s_channel_label_' + id).remove();
    },

    editChannelSettings(channel) {

    },

    viewSize() {
        const html = document.querySelector('html');
        return { width: html.clientWidth, height: html.clientHeight };
    },

    setupCanvasSize(canvas) {
        const vs = this.viewSize();
        const htmlWidth = vs.width;
        const htmlHeight = vs.height;
        var updated = false;
        // auto size canvas (maximize)
        if (canvas.width !== htmlWidth - settings.ui.clientWidthBorder) {
            canvas.width = htmlWidth - settings.ui.clientWidthBorder;
            updated = true;
        }
        if (canvas.height !== htmlHeight - settings.ui.clientHeightBorder) {
            canvas.height = htmlHeight - settings.ui.clientHeightBorder;
            updated = true;
        }
        return updated;
    },

    checkSizeChanged() {
        const html = document.querySelector('html');
        const htmlWidth = html.clientWidth;
        const htmlHeight = html.clientHeight;
        var updated =
            canvas.width !== htmlWidth - settings.ui.clientWidthBorder
            || canvas.height !== htmlHeight - settings.ui.clientHeightBorder;
        return updated;
    }
}
