// ui

ui = {

    oscilloscope: null,     // reference to the oscilloscope manager
    initialized: false,     // object initialized
    uiInitialized: false,   // indicates if ui is already globally initialized
    popupId: null,          // any id of an html popupId currently opened/showed
    popupCtrlId: null,      // popup control placement if any else null
    bindings: [],           // array of bindings for controls
    toggles: [],
    popups: new Popups(),
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
        this.popups.init_popups();
        this.popupSettings.init()
        this.channels.popupSettings.init()
    },

    initBindedControls() {
        // Initialize bindings for UI controls
        this.bindings.forEach(b => {
            if (b.init != null)
                b.init();
        });
        app.updateDisplay()
    },

    binding(controlId, valuePath, t) {
        const r = {
            controlId: controlId,
            valuePath: valuePath,
            sym: null,
            onChanged: null,
            onPostChanged: null,
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
        const { controlId, valuePath, sym, onChanged, onPostChanged, onInit, readOnly, unit, attr, digits } = binding;
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
                try {
                    const v = eval(valuePath) + unit;
                    if (attr == 'text')
                        $ctrl.text(v)
                    else
                        $ctrl.attr(attr, v);
                    $ctrl.val(v);
                    $ctrl.attr('data-inival', v);
                    binding.input.value = v
                } catch (err) {
                    // ignore or debug
                    if (settings.debug.debug)
                        console.log(valuePath, err)
                }
            }
            else
                onInit();
        };
        app.addOnStartUI(() => {
            init($c);
        });

        var onChange = () => {
            const v = $c.val();
            const s = (sym == null)
                ? '' : sym;
            if (onChanged != null)
                onChanged();
            else {
                try {
                    eval(valuePath + '=' + s + v + s);
                    if (onPostChanged != null)
                        onPostChanged(v)
                } catch (err) {
                    // ignore or debug
                    if (settings.debug.debug)
                        console.log(err)
                }
            }
            app.updateDisplay();
        };

        this.initBindedControls();

        if (!readOnly) {
            $c.on('change', () => {
                onChange();
            });
        }

        this.bindings.push({ init: init, onChange: onChange, props: binding });
        return this
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

    setToggle(controlId, state) {
        const $c = $('#' + controlId)
        const path = $c.attr('tag')
        const hasPath = path !== undefined && path != null
        const inverted = $c.attr('data-inverted') == 'true'
        const vstate = inverted ? !state : state

        if (vstate) {
            $c.addClass('on')
            $c.removeClass('off')
        }
        else {
            $c.addClass('off')
            $c.removeClass('on')
        }

        $c.text(vstate ? 'ON' : 'OFF')

        if (hasPath) {
            try {
                eval(path + '=' + state)
            } catch (err) {
                // ignore or debug
                if (settings.debug.debug)
                    console.log(err)
            }
        }
        return this
    },

    updateToggle(controlId, forceVal) {
        const $c = $('#' + controlId)
        const path = $c.attr('tag')
        const hasPath = path !== undefined && path != null
        if (hasPath) {
            // eval context is ui
            try {
                const val =
                    (forceVal !== undefined && forceVal != null) ?
                        forceVal : eval(path)
                this.setToggle(controlId, val)
            } catch (err) {
                // ignore or debug
                if (settings.debug.debug)
                    console.log(err)
            }
        }
    },

    updateToggles() {
        const t = this
        this.toggles.forEach(cid => {
            const $c = $('#' + cid)
            t.updateToggle(cid)
        })
    },

    initToggle(controlId, onChange, path, inverted) {
        const $c = $('#' + controlId)
        const hasPath = path !== undefined && path != null
        if (hasPath)
            $c.attr('tag', path)
        if (inverted === undefined || inverted == null)
            inverted = false
        $c.attr('data-inverted', inverted ? 'true' : 'false')

        $c.on('click', () => {
            this.setToggle(controlId,
                $c.hasClass(
                    inverted ? 'on' : 'off'))
            if (onChange != undefined && onChange != null) onChange($c)
        })
        this.toggles.push(controlId)
        return this
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
        })
        return this
    },

    selectTab(selectedTabId, tabs) {
        const panes = [...tabs];
        const btIdToPaneId = t => {
            if (t === undefined || t == null) return null
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
