// ui

ui = {

    oscilloscope: null,     // reference to the oscilloscope manager
    initialized: false,     // object initialized
    uiInitialized: false,   // indicates if ui is already globally initialized
    popupId: null,          // any id of an html popupId currently opened/showed
    popupCtrlId: null,      // popup control placement if any else null
    bindings: [],           // array of bindings for controls
    oscilloMenu: new OscilloMenu(),
    channels: new Channels(),
    popupSettings: new PopupSettings(),
    inputWidgets: new InputWidgets(),

    init(oscilloscope) {

        this.oscilloscope = oscilloscope;

        this.oscilloscope.channels.forEach(channel => {
            if (!channel.ui) {
                this.channels.init_channel_btns(channel, channel.view);
                channel.ui = true;
            }
        });

        if (!this.uiInitialized) {
            this.init_ui();
            this.uiInitialized = true;
            console.log("UI initialized");
        }
    },

    init_ui() {
        // events
        $(window).resize(() => {
            if (oscilloscope.pause)
                app.requestAnimationFrame();
        });
        // properties
        $('input').attr('autocomplete', 'off');
        // bindins
        this.bind(this.binding(
            'app_ver',
            'settings.app.version',
            { readOnly: true, attr: 'text' }));
        // menus & popups
        this.oscilloMenu.initMenu();
        this.init_popups();
        this.channels.popupSettings.initChannelSettingsPane()
    },

    init_popups() {
        $('.popup-close').on('click', () => {
            const p = this.popupId;
            this.popupId = null;
            this.control = null;
            this.togglePopup(null, p, false);
            this.inputWidgets.closeInputWidget();
        });
        this.popupSettings.init();
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
                delta: 1,
                min: 0,
                max: null
            }
        };
        const res = t = null ? r : { ...r, ...t };
        if (res.input.min == null)
            res.input.min = 0;
        return res;
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
                t.inputWidgets.openInputWidget(controlId);
            });
        }

        const t = this;
        const init = ($ctrl) => {
            const $o = $c;
            if ($ctrl == null) $ctrl = $o;
            // initial value
            if (onInit == null) {
                const v = eval(valuePath) + unit;
                if (attr == 'text')
                    $ctrl.text(v)
                else
                    $ctrl.attr(attr, v);
                $ctrl.val(v);
                $ctrl.attr('data-inival', v);
                binding.input.value = v
            }
            else
                onInit();
        };
        app.addOnStartUI(() => {
            init($c);
        });

        var onChange = () => {
            const $v = $c.val();
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

        this.bindings.push({ init: init, onChange: onChange, props: binding });
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
        $c.attr('data-inival', value);
        $c.val(value);
        binding.onChange();
    },

    initToggle(controlId, onChange) {
        const $c = $('#' + controlId)
        $c.on('click', () => {
            onChange($c)
            $c.toggleClass('on')
            $c.toggleClass('off')
            $c.text($c.hasClass('on') ? 'ON' : 'OFF')
        })
    },

    initTabs(tabs, opts) {
        const t = this;
        if (opts === undefined || opts == null) opts = {}
        tabs.forEach(e => {
            const $c = $('#' + e);
            $c.on('click', () => {
                if (!$c.hasClass('selected')
                    && !$c.hasClass('menu-item-disabled')) {
                    if (opts.onChange)
                        opts.onChange($c)
                    t.selectTab($c.attr('id'), tabs);
                }
            });
        });
    },

    selectTab(selectedTabId, tabs) {
        const panes = [...tabs];
        const btIdToPaneId = t => {
            return t.replace('btn_', 'opts_');
        }
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
        this.inputWidgets.closeInputWidget();
    },

    closePopup() {
        if (this.popupId == null) return
        if (this.popupId != null) {
            const p = this.popupId
            this.popupId = null
            this.togglePopup(null, p, false)
        }
    },

    togglePopup(control, popupId, showState, align) {
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
                const vs = this.viewSize()
                if (align == 'center-middle-top') {
                    left = (vs.width - w) / 2.0;
                    top = (vs.height - h) / 4.0;
                }
                else {
                    if (align == 'center-top') {
                        left = (vs.width - w) / 2.0;
                        top = 12;
                    }
                    else {
                        // center
                        left = (vs.width - w) / 2.0;
                        top = (vs.height - h) / 2.0;
                    }
                }
            }
            this.popupCtrlId = control;
            $popup.css('left', left);
            $popup.css('top', top);
        }
        if (!$popup.hasClass('hidden'))
            this.inputWidgets.closeInputWidget()
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
