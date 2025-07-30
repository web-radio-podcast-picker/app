// ui

ui = {

    oscilloscope: null,     // reference to the oscilloscope manager
    initialized: false,     // object initialized
    uiInitialized: false,   // indicates if ui is already globally initialized
    popupId: null,          // any id of an html popupId currently opened/showed
    popupCtrlId: null,      // popup control placement if any else null
    bindings: new Bindings(),
    toggles: new Toggles(),
    popups: new Popups(),
    oscilloMenu: new OscilloMenu(),
    channels: new Channels(),
    popupSettings: new PopupSettings(),
    inputWidgets: new InputWidgets(),
    tabs: new Tabs(),

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
            oscilloscope.refreshView()
        })
        // properties
        $('input').attr('autocomplete', 'off');
        // bindins
        this.bindings.bind(this.bindings.binding(
            'app_ver',
            'settings.app.version',
            { readOnly: true, attr: 'text' }));
        // menus & popups
        this.oscilloMenu.initMenu();
        this.popups.init_popups();
        this.popupSettings.init()
        this.channels.popupSettings.init()
    },

    getCurrentChannel() {
        return this.channels.popupSettings.editChannel
    },

    getCurrentChannelPath(subPath) {
        return 'ui.channels.popupSettings.editChannel.'
            + ((subPath == null || subPath === undefined) ?
                '' : subPath)
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

    setupUIComponents() {
        const vs = this.viewSize();
        const w = vs.width - settings.ui.clientWidthBorder;
        const h = vs.height - settings.ui.clientHeightBorder;

        const $b = $('#buttons_bar')
        const left = w - 118 - 118 + 7
        const top = h - 42 - 7 * 8
        $b.css('left', left + 'px')
        $b.css('top', top + 'px')
        $b.removeClass('hidden')

        const $p = $('#bottom-pane')
        $p.css('left', 50 + 'px')
        const btop = h - 21 - 7 * 6
        $p.css('top', btop + 'px')
        $p.removeClass('hidden')

        const $p2 = $('#right_bottom_pane')
        $p2.css('left', w - 25 * 7 + 'px')
        $p2.css('top', btop + 'px')
        $p2.removeClass('hidden')
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
